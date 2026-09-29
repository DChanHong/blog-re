# Retained verification evidence

2026-09-29: 사용자가 승인한 정리 작업으로 중복 캡처, 중간 결과, 로컬 빌드 경로와 구형 검증 스크립트를 제거했다. 이전 검증 판정은 당시 기록이며, 삭제된 증거 전체는 Git 커밋 `5b71b15`에 보존되어 있다. 검증 문서의 `Archived` 표시는 이 커밋에서 확인할 수 있는 과거 자료다.

## 현재 남긴 자료

- Plan 03: Home desktop/mobile × light/dark 대표 이미지 4개와 최종 JSON 보고서·폰트 목록.
- Plan 04: 참고/최종 화면 desktop/mobile × light/dark 8개, 최종 첫 화면 2개, 최종 JSON 보고서와 실행 전 소스 해시.
- 계획서 및 최종 검증 Markdown 문서는 유지한다. Plan 00–02 자료는 이번 정리에서 변경하지 않았다.
- 현재 Home 기준 재검사 도구 `audit/04-workspace.cjs`, `04-http-check.cjs`, `04-local-evidence.cjs`는 유지한다. 구형 Home DOM과 과거 임시 경로를 전제로 한 `03-*.cjs`는 삭제했다.

## 재실행과 복구

`04-workspace.cjs build`를 먼저 실행하면 현재 checkout과 분리된 빌드를 만들고 `build-workspace.json`을 다시 생성한다. 그 후 `typecheck`/`start`를 사용할 수 있다. HTTP 검사는 로컬 production 3101과 fixture 3102가 필요하다. 기존 보고서를 덮어쓸 수 있으므로 재검사 전 Git 상태를 확인한다. 이 정리에서 DB·배포·패키지 의존성·실행 중인 개발 서버 캐시는 변경하지 않았다.

삭제 파일은 `git show 5b71b15:저장소_상대경로`로 읽거나 `git restore --source=5b71b15 -- 정확한_파일_경로`로 선택 복구할 수 있다. 현재 수정한 파일에 덮어쓰지 않도록 복구 대상을 먼저 확인한다. Git 이력은 유지하므로 이번 삭제가 `.git` 용량을 줄이는 작업은 아니다.
