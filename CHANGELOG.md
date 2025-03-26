## [0.6.6](https://github.com/brillout/test-e2e/compare/v0.6.5...v0.6.6) (2025-03-26)


### Bug Fixes

* remove config validation ([d460f07](https://github.com/brillout/test-e2e/commit/d460f070a89c46930c78f53b472ebbb7bb155b4b))



## [0.6.5](https://github.com/brillout/test-e2e/compare/v0.6.4...v0.6.5) (2025-03-26)


### Features

* chromiumLaunchOptions ([906a964](https://github.com/brillout/test-e2e/commit/906a96470536280e07177c7e71da7a8253b292d9))



## [0.6.4](https://github.com/brillout/test-e2e/compare/v0.6.3...v0.6.4) (2025-03-20)


### Bug Fixes

* remove faulty assert() ([a3ea521](https://github.com/brillout/test-e2e/commit/a3ea5210f32f9d9f5bf69e6ea3d0bb4e5d442b6e))



## [0.6.3](https://github.com/brillout/test-e2e/compare/v0.6.2...v0.6.3) (2025-02-20)


### Bug Fixes

* remove failing assert ([073eaf9](https://github.com/brillout/test-e2e/commit/073eaf9bee07aea46712538a36368abc3bbb082d))
* simplify assert() impl ([d4a05bb](https://github.com/brillout/test-e2e/commit/d4a05bbc34475c47a995a1daeb6cdc257157e9ba))
* typo ([c58016e](https://github.com/brillout/test-e2e/commit/c58016e9b7d830aa7e6a67aa090537ff54584b5a))



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



