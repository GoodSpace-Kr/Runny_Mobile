# Runny Mobile Context

Runny 모바일 앱의 백엔드 연동 규칙, 3D 모델 렌더링 방향, 프론트엔드 구현 책임을 정리한 문서다.

기획 문서와 다른 부분은 이 문서의 백엔드 연동 규칙을 기준으로 한다.

---

## 1. 현재 프로젝트 상태

- 프로젝트: React Native bare app
- 앱 이름: `Runny`
- 이 문서는 구현 코드가 아니라 연동/렌더링 방향을 정리한 참고 문서다.
- 3D 렌더링 검증 코드는 main 반영 대상이 아니므로 제거된 상태를 기준으로 한다.
- 이후 3D 구현 시 WebView 방식은 지양하고 네이티브 GL 렌더링 계열을 우선 검토한다.

---

## 2. 3D 렌더링 검증 결론

### 2.1 구현 방향

강아지 본체와 아이템을 합성해야 하는 제품 구조이므로 WebView보다 네이티브 GL 기반 렌더링이 맞다.

권장 방향:

- React Native + `react-native-filament` 또는 동급 네이티브 GL 렌더러
- 네이티브 Metal/OpenGL 계열 렌더링
- GLB 직접 로드
- 추후 강아지 본체 GLB 위에 모자, 선글라스, 옷, 신발, 장난감, 이펙트 GLB를 슬롯별로 attach

추후 제품 구조:

- 메인 커스터마이징 화면: 활성 강아지 1개 중심
- 아이템 구매/착용 시 해당 아이템 GLB만 추가 로드
- 여러 강아지/아이템 썸네일 리스트는 저해상도, 정지 모델, 이미지 프리뷰 등으로 분리

### 2.2 검증에 사용한 GLB 산출물

아래 파일들은 로컬 검증 과정에서 사용했던 산출물이다. main 반영 대상이 아니며, 제품 코드에서 참조하지 않는다.

- `shibainu_smell.glb`: 원본
- `shibainu_smell_pruned.glb`: prune 검증
- `shibainu_smell_only.glb`: smell mesh만 남긴 정적 검증
- `shibainu_smell_motion.glb`: smell mesh + animation
- `shibainu_smell_motion_rotation.glb`: translation animation channel 제거, rotation/scale 중심
- `shibainu_smell_motion_rotation_1.glb` ~ `_4.glb`: 5개 동시 로드 부하 검증용 복제 파일

제품 코드에서는 복제 파일을 사용하지 않는다.

### 2.3 부하 측정 결과

단일 강아지 애니메이션 검증, iOS Simulator 기준:

- CPU: 대략 20% 전후
- RSS: 약 171MB 근처
- physical footprint: 약 155.8MB
- peak: 약 313MB

5개 복제 GLB 로드/애니메이션 검증:

- CPU: 대략 16%~21% 전후, peak 30% 근처
- RSS: 상황별 약 150MB~214MB
- physical footprint: 약 329.1MB
- physical footprint peak: 약 857.7MB

중요 판단:

- 평균 CPU보다 peak memory가 더 위험하다.
- `857.7MB peak`는 저사양 기기에서 메모리 경고 또는 앱 종료 위험이 있다.
- 5개 검증은 같은 GLB를 파일 단위로 복제해 로드했으므로 텍스처/GPU 리소스 중복 피크가 과장되었을 수 있다.
- 그래도 제품 구조에서도 텍스처 최적화 없이는 위험하다.

### 2.4 텍스처 분석

`assets/shibainu_smell_motion_rotation.glb` 내부 PNG:

| 텍스처 | 해상도 | 디코딩 후 RGBA | 밉맵 포함 추정 |
|---|---:|---:|---:|
| `shibainu.texture` | 4096x4096 | 약 64MB | 약 85MB |
| `shiba+inu+plush+3d+model_basecolor` | 2048x2048 | 약 16MB | 약 21MB |

강아지 1개도 텍스처만 대략 80~106MB까지 갈 수 있다.

필수 최적화:

- 4096 텍스처를 우선 1024 또는 최대 2048로 다운스케일
- 가능하면 PNG/JPEG 대신 GPU 압축 텍스처 사용
- KTX2/Basis 계열 검토
- 같은 GLB를 여러 파일로 복제 로드하지 않기
- 화면 종료 시 Filament 리소스가 반환되는지 검증
- 모델 교체 시 기존 Entity, MaterialInstance, Texture, VertexBuffer가 제거되는지 확인

반드시 확인할 것:

- 화면 진입 때마다 700~850MB까지 반복 상승하는지
- 여러 모델을 순차적으로 열 때 최고점이 계속 올라가는지
- 화면 종료 후 GPU 리소스가 반환되는지
- 고해상도 텍스처를 원본 크기로 디코딩하는지
- 모델 교체 시 기존 Filament 리소스가 제거되는지

---

## 3. 백엔드 연동 가이드

아래 내용은 첨부된 `Runny 백엔드 연동 가이드 (프론트엔드용)`의 확정 사항을 이 프로젝트 컨텍스트에 포함한 것이다. 기획 문서 v4와 다른 부분은 이 내용을 기준으로 한다.

서버:

- Spring Boot 4.0.7
- base path: `/api`
- 모든 시각: KST `Asia/Seoul`

### 3.1 공통 인증

- 로그인/가입 성공 시 `accessToken` 1시간, `refreshToken` 14일 발급
- 모든 인증 API 요청 헤더: `Authorization: Bearer {accessToken}`
- 401 응답 시 `POST /api/auth/refresh`로 토큰 재발급
- refresh 실패 시 로그인 화면으로 이동
- 인증 불필요: `/api/auth/**`, `/api/health`

공통 응답:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "QUEST_001",
    "message": "아직 달성하지 않은 퀘스트입니다."
  }
}
```

- 에러코드는 `{도메인}_{3자리}` 형식
- 프론트는 `error.code`로 분기
- `message`는 사용자에게 그대로 노출 가능

단위:

- 거리: km
- 시간: sec
- 페이스: sec/km
- 코인: integer

### 3.2 온보딩

로그인 계열 응답에는 항상 `onboardingStatus`가 포함된다.

- `PROFILE_REQUIRED`
- `DOG_REQUIRED`
- `COMPLETED`

`COMPLETED`가 아니면 메인 놀이터 진입을 막고 해당 온보딩 단계로 라우팅한다.

### 3.3 기획 문서 대비 최종 변경 사항

프론트 작업에 영향 있는 핵심 변경:

| 영역 | 최종 확정 |
|---|---|
| 강아지/아이템 외형 | 이미지 URL이 아니라 GLB URL |
| 모델 필드명 | `modelUrl`, `breedModelUrl`, `dogModelUrl` |
| 업적 아이콘, 크루 로고, 스티커, 경로 이미지 | 이미지 리소스 유지 |
| 일일 고정 퀘스트 | 접속 100xp, 러닝 완료 200xp, 1km 이상 500xp |
| 일일 랜덤 퀘스트 | 7종 중 2종, 수치 고정, 100xp + 코인 10~30 |
| 주간 퀘스트 | 8종 중 랜덤 3종, 매주 월요일 초기화 |
| 업적 | 코인 업적 19종 + 견종 해금 2종 = 21종 |
| 러닝 종료 요청 | `newRoute`, `steadyPaceKm` 추가, 프론트 계산 |
| 꾸미기 이벤트 | `decorate-enter`, `decorate` 2종 |
| 친구 검색 | 페이징 제거 |
| 아이템 | 71종, 가격대 CHEAP/MID/PREMIUM |

---

## 4. 도메인별 API 요약

### 4.1 인증/유저

경로:

- `/api/auth`
- `/api/users`

핵심 API:

- `POST /auth/email/send-code`
- `POST /auth/email/verify-code`
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/social/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/password/send-code`
- `POST /auth/password/verify-code`
- `POST /auth/password/reset`
- `GET /users/nickname/check`
- `POST /users/me/profile`
- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/password`
- `DELETE /users/me`

소셜 로그인:

- 기존 유저: `isNewUser=false` + token 발급
- 신규 약관 미동의: `isNewUser=true` + token null
- 신규이면 약관 화면으로 보낸 뒤 동의값 포함해 재요청

설정:

- `provider`가 `EMAIL`일 때만 비밀번호 변경 메뉴 노출

### 4.2 강아지

경로:

- `/api/breeds`
- `/api/dogs`

핵심 API:

- `GET /breeds`
- `POST /dogs`
- `GET /dogs/me`
- `PATCH /dogs/active`
- `GET /dogs/active/profile`

중요:

- 견종 응답에 `modelUrl` GLB 포함
- 보유 강아지 목록은 `breedModelUrl`
- 온보딩 첫 선택은 일반 견종만 무료
- 레어 견종은 `achievementLocked`, `unlocked`를 보고 UI 비활성/조건 표시
- `GET /dogs/active/profile`은 조회 시 변화 요약 확인 처리됨
- 변화 연출은 응답의 `changeSummary`로 1회만 수행

### 4.3 놀이터/친구

경로:

- `/api/playground`
- `/api/friends`

`GET /playground` 응답 핵심:

```json
{
  "me": {
    "userId": 1,
    "nickname": "기웅",
    "dog": {
      "dogId": 3,
      "name": "콩이",
      "breedName": "시바견",
      "level": 12,
      "breedModelUrl": ".../breed/2.glb",
      "equippedItems": [
        {
          "category": "HAT",
          "itemId": 25,
          "modelUrl": ".../item/25.glb"
        }
      ]
    }
  },
  "invitedFriends": [],
  "coin": 1200,
  "hasDogProfileBadge": true
}
```

중요:

- 강아지 렌더링은 `breedModelUrl` GLB 위에 `equippedItems[].modelUrl` GLB를 합성한다.
- 합성은 프론트 3D 렌더링 책임이다.
- `hasDogProfileBadge`는 펫 프로필 버튼 빨간 점이다.

친구 API:

- `GET /friends`
- `GET /friends/search?nickname=`
- `POST /friends/requests`
- `DELETE /friends/requests/{id}`
- `GET /friends/requests/received`
- `POST /friends/requests/{id}/accept`
- `POST /friends/requests/{id}/reject`
- `DELETE /friends/{friendUserId}`
- `GET /friends/{friendUserId}/detail`
- `PUT /playground/invites`

친구 검색 `relationStatus`:

- `NONE`
- `REQUESTED`
- `RECEIVED`
- `FRIEND`

초대 친구는 최대 4명이며 `PUT /playground/invites`는 전체 교체 방식이다.

### 4.4 드레스룸/상점/결제

경로:

- `/api/dressroom`
- `/api/shop`
- `/api/payments`

드레스룸:

- `GET /dressroom/items?category=`
- `PUT /dressroom/equipment`
- `GET /dressroom/equipment`

장비 슬롯:

- `collar`
- `clothes`
- `hat`
- `shoes`
- `toy`
- `effect`

`PUT /dressroom/equipment`은 6슬롯 전체 저장 방식이다. 미리보기, 즉시착용, 토글은 프론트 로컬 상태에서 처리한다.

상점:

- `GET /shop/access`
- `GET /shop/items?category=`
- `POST /shop/purchase`
- `GET /shop/coin-products`

중요:

- 상점은 활성 강아지 10레벨 조건
- `tier`: `CHEAP`, `MID`, `PREMIUM`
- 가격대: 저렴 ~199, 중간 200~499, 고급 500~
- `POST /shop/purchase`는 `itemIds` 배열
- 이미 보유 아이템이 하나라도 포함되면 전체 실패
- 구매 성공 시 즉시 착용

결제:

- `POST /payments/orders`
- NicePay 결제창
- `POST /payments/approve`
- 동일 `orderId` 재요청은 멱등 처리

### 4.5 크루

경로:

- `/api/crews`

핵심 API:

- `GET /crews/search?name=`
- `GET /crews/{crewId}`
- `GET /crews/name/check`
- `POST /crews`
- `GET /crews/me`
- `POST /crews/{id}/join-requests`
- `DELETE /crews/{id}/join-requests`
- `GET /crews/{id}/join-requests`
- `POST /crews/{id}/join-requests/approve`
- `POST /crews/{id}/join-requests/reject`
- `PATCH /crews/{id}/name`
- `PATCH /crews/{id}/intro`
- `PATCH /crews/{id}/image`
- `PATCH /crews/{id}/capacity`
- `DELETE /crews/{id}/members/{userId}`
- `DELETE /crews/{id}`
- `PATCH /crews/{id}/leader`

중요:

- 크루명 최대 8자
- 소개 최대 30자
- 크루 생성은 multipart
- 크루명 변경은 1000코인
- 정원 증설은 1000코인당 +50
- 크루장 UI는 `role`로 제어

### 4.6 퀘스트

경로:

- `/api/quests`

API:

- `GET /quests/today`
- `POST /quests/{userQuestId}/claim`
- `POST /quests/events/decorate-enter`
- `POST /quests/events/decorate`

`GET /quests/today`:

- daily: 고정 3 + 랜덤 2 = 5개
- weekly: 랜덤 3개
- 조회 자체가 접속 이벤트다.
- 앱 진입 또는 메인 로드 시 하루 1회 호출 권장

항목 예시:

```json
{
  "userQuestId": 10,
  "type": "DAILY_RANDOM",
  "conditionType": "DISTANCE",
  "title": "3km 달리기",
  "targetValue": 3,
  "progress": 2.1,
  "rewardExp": 100,
  "rewardCoin": 30,
  "completed": false,
  "claimed": false
}
```

프론트 UI:

- 진행도: `progress / targetValue`
- 완료 취소선: `completed`
- 수령 버튼: `completed && !claimed`

꾸미기 이벤트:

- `POST /quests/events/decorate-enter`: 히스토리 꾸미기 편집 화면 진입 시
- `POST /quests/events/decorate`: 꾸미기 저장/공유 완료 시

### 4.7 업적

경로:

- `/api/achievements`

API:

- `GET /achievements`
- `POST /achievements/{id}/claim`

중요:

- 전체 21종
- `imageUrl`은 PNG 아이콘
- 필터는 프론트 처리
- 견종 해금형은 claim 시점이 해금 시점
- 이후 `/breeds`에서 `unlocked=true`
- 러닝 완료 응답의 `achievedAchievements`로 리포트 화면에서 달성 연출

### 4.8 러닝

경로:

- `/api/runnings`
- `/api/images/route`
- `/api/stickers`

흐름:

1. `POST /runnings/start` 선택
2. 프론트에서 GPS 측정
3. `POST /images/route`로 경로 이미지 2종 업로드
4. `POST /runnings/complete`

프론트 책임:

- GPS
- 거리
- 시간
- 평균 페이스
- 케이던스
- 일시정지
- 최장 무정지 시간
- 1km 구간 페이스
- `newRoute` 판정
- `steadyPaceKm` 계산
- 랜드마크 방문 판정
- 경로 이미지 생성/업로드

`CompleteRequest` 주요 필드:

| 필드 | 설명 |
|---|---|
| `clientRunId` | UUID 멱등키 |
| `distanceKm` | 총 거리 |
| `durationSec` | 총 시간 |
| `avgPaceSec` | 평균 페이스 |
| `cadence` | 케이던스 |
| `avgHeartRate` | 웨어러블 없으면 null |
| `longestNonstopSec` | 최장 무정지 시간 |
| `splitPaces` | 1km 구간별 페이스 배열 |
| `elevationM` | 고도 |
| `routeImageUrl` | 지도 캡처 URL |
| `routeLineImageUrl` | 투명 배경 경로 선 URL |
| `startedAt` | 시작 시각 |
| `endedAt` | 종료 시각 |
| `visitedLandmarkIds` | 방문 랜드마크 ID 목록 |
| `newRoute` | 프론트 판정 |
| `steadyPaceKm` | 프론트 계산 |

`CompleteResponse`:

- `discarded`: 0.03km 미만 폐기
- `idempotent`
- `report`
- `statDelta`
- `completedQuests`
- `achievedAchievements`

기타 API:

- `GET /runnings/{recordId}/report`
- `GET /runnings/history?year=&month=`
- `GET /runnings/unchecked-exists`
- `GET /stickers`

러닝 리포트의 `dogAppearance`는 당시 착용 GLB 스냅샷이다. 이후 코디 변경과 무관해야 한다.

칼로리 로컬 계산:

```text
kcal = 1.036 x 체중(kg) x 거리(km)
```

최종값은 서버 계산치를 신뢰한다.

### 4.9 설정/알림/코인

경로:

- `/api/settings`
- `/api/notifications`
- `/api/coins`

API:

- `GET /settings/me`
- `GET /settings/notifications`
- `PATCH /settings/notifications`
- `GET /notifications`
- `GET /notifications/unread-exists`
- `GET /coins/me`
- `GET /coins/transactions`

중요:

- `GET /settings/me`는 강아지 이름, `dogModelUrl`, 이메일, provider 포함
- 알림 목록 조회 시 읽음 처리
- 코인 내역은 페이징

---

## 5. 빨간 점 배지 규칙

| 위치 | 근거 API / 필드 | 해제 시점 |
|---|---|---|
| 놀이터 펫 프로필 버튼 | `GET /playground` -> `hasDogProfileBadge` | 펫 프로필 조회 |
| 받은 친구 요청 | `GET /friends/requests/received` | 목록 조회 |
| 크루 관리 버튼 | `GET /crews/me` -> `pendingRequestCount` | 승인/거절 |
| 홈 미확인 리포트 | `GET /runnings/unchecked-exists` | 리포트 상세 조회 |
| 알림 | `GET /notifications/unread-exists` | 알림 목록 조회 |

패턴:

- 존재 여부 API로 빨간 점 표시
- 목록/상세 조회가 읽음 처리
- 별도 읽음 API 호출 불필요

---

## 6. 3D 모델 및 정적 리소스 규칙

| 리소스 | 형식 | URL 규칙 | 응답 필드 |
|---|---|---|---|
| 견종 외형 | GLB | `{S3}/breed/{breedId}.glb` | `modelUrl`, `breedModelUrl`, `dogModelUrl` |
| 아이템 | GLB | `{S3}/item/{itemId}.glb` | `modelUrl` |
| 업적 아이콘 | PNG | `{S3}/achievement/{code소문자}.png` | `imageUrl` |
| 크루 로고 | 이미지 | 업로드 시 UUID 파일명 | `imageUrl` |
| 스티커 | 이미지 | seed | `imageUrl` |
| 러닝 경로 2종 | 이미지 | `route/` prefix | `routeImageUrl`, `routeLineImageUrl` |

프론트 규칙:

- 항상 응답 URL을 그대로 로드한다.
- GLB는 네이티브 3D 렌더러로 로드한다.
- 강아지 본체 GLB + 착용 아이템 GLB를 슬롯별로 합성한다.
- 모델 URL이 404일 수 있으므로 플레이스홀더 또는 기본 모델 폴백이 필수다.
- 러닝 리포트 `dogAppearance`는 당시 모습 스냅샷이다.

---

## 7. 프론트 책임 체크리스트

- 소셜 SDK 토큰 발급 후 백엔드 전달
- `isNewUser` 분기
- 약관 화면 처리
- `onboardingStatus` 기반 라우팅
- 토큰 저장
- refresh interceptor
- GPS 측정 전반
- `newRoute` 판정
- `steadyPaceKm` 계산
- 랜드마크 방문 판정
- 경로 이미지 2종 생성 및 업로드
- 실시간 칼로리 로컬 계산
- `clientRunId` 발급
- 오프라인 저장 및 동일 키 재동기화
- GLB 3D 렌더링
- 아이템 GLB 합성
- 모델 로딩 실패 폴백
- 꾸미기 편집기
- 꾸미기 진입/완료 이벤트 호출
- 에러코드 기반 사용자 메시지 처리

---

## 8. 주요 에러코드

| 코드 | 상황 |
|---|---|
| `COIN_001` | 코인 잔액 부족 |
| `QUEST_001` | 미달성 퀘스트 수령 |
| `QUEST_002` | 퀘스트 중복 수령 |
| `QUEST_003` | 만료 퀘스트 수령 |
| `ACHIEVEMENT_001` | 미달성 업적 수령 |
| `ACHIEVEMENT_002` | 업적 중복 수령 |
| `DOG_005` | 미해금 레어 입양 |
| `DOG_006` | 온보딩 레어 선택 |
| `ITEM_002` | 미보유 아이템 착용 |
| `CREW_005` | 이미 크루 소속 |
| `CREW_008` | 크루 정원 초과 |
| `CREW_010` | 크루장 탈퇴 시도 |
| `PAYMENT_001` | 금액 불일치 |
| `PAYMENT_003` | 승인 실패 |
| `RUNNING_001` | 비정상 러닝 데이터 |
| `RUNNING_002` | 미래 시각 |
| `FRIEND_001~005` | 친구 요청/초대 관련 오류 |

전체 코드와 메시지는 Swagger `/swagger-ui` 및 백엔드 `ErrorCode` enum을 기준으로 한다.

---

## 9. 다음 작업 권장 순서

1. 3D 검증 산출물 보관 여부 결정
2. `shibainu_smell_motion_rotation.glb` 텍스처 다운스케일 버전 생성
3. 단일 강아지 + 장비 슬롯 attach 구조 설계
4. 백엔드 `breedModelUrl`, `equippedItems[].modelUrl` 응답 기반 로더 작성
5. 모델 URL 404 폴백 작성
6. 화면 진입/종료 시 memory peak 및 resource release 확인
7. 상점/드레스룸 로컬 미리보기 상태와 저장 API 분리 구현

주의:

- 여러 모델을 동시에 띄워야 하는 화면에서는 절대 GLB 파일 복제 로드로 접근하지 않는다.
- 리스트나 썸네일은 가능하면 2D 이미지, 저해상도 모델, 정지 프리뷰를 사용한다.
- 커스터마이징 메인 화면에서만 고품질 GLB와 애니메이션을 유지한다.
