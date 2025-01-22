# [0.6.0](https://github.com/brillout/test-e2e/compare/v0.5.38...v0.6.0) (2025-01-22)


### Bug Fixes

* make expectLog() future-proof ([746bc6c](https://github.com/brillout/test-e2e/commit/746bc6c87bafe9e4859920802514e960e18fb2a5))


### BREAKING CHANGES

* Apply the following change to your `expectLog()` calls:
  ```diff
  - expectLog('someText', (log) => someCondition(log))
  + expectLog('someText', { filter: (log) => someCondition(log) })
  ```



