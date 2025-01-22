## [0.6.2](https://github.com/brillout/test-e2e/compare/v0.6.1...v0.6.2) (2025-01-22)


### Bug Fixes

* improve error message ([7361a7b](https://github.com/brillout/test-e2e/commit/7361a7bdcbbc1aefc021c0d3fe8c374d13252294))



## [0.6.1](https://github.com/brillout/test-e2e/compare/v0.6.0...v0.6.1) (2025-01-22)


### Features

* new option `expectLog('someText', { allLogs: true })` ([615723f](https://github.com/brillout/test-e2e/commit/615723f9eed788f2afad25a6e5f32f13a823a0a4))



# [0.6.0](https://github.com/brillout/test-e2e/compare/v0.5.38...v0.6.0) (2025-01-22)


### Bug Fixes

* make expectLog() future-proof ([746bc6c](https://github.com/brillout/test-e2e/commit/746bc6c87bafe9e4859920802514e960e18fb2a5))


### BREAKING CHANGES

* Apply the following change to your `expectLog()` calls:
  ```diff
  - expectLog('someText', (log) => someCondition(log))
  + expectLog('someText', { filter: (log) => someCondition(log) })
  ```



