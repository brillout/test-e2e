## [0.6.18](https://github.com/brillout/test-e2e/compare/v0.6.17...v0.6.18) (2025-08-06)


### Features

* new option `run({ verbose })` ([b35289f](https://github.com/brillout/test-e2e/commit/b35289f24f8dbe7ba43a04bbd14c504f839af232))



## [0.6.17](https://github.com/brillout/test-e2e/compare/v0.6.16...v0.6.17) (2025-08-05)


### Bug Fixes

* remove TEST_INSPECT ([91a7f98](https://github.com/brillout/test-e2e/commit/91a7f984666027dd70dd1afdb4e5de4e902e7aa7))



## [0.6.16](https://github.com/brillout/test-e2e/compare/v0.6.15...v0.6.16) (2025-07-30)


### Bug Fixes

* `export type { TolerateError }` ([d6b8364](https://github.com/brillout/test-e2e/commit/d6b8364dbf50bd207494514c630993735ccdcf6e))
* use standard fetch() instead of node-fetch ([acebd7f](https://github.com/brillout/test-e2e/commit/acebd7f9439292fbc7bdaf3c95ed0364cc1ef4c5))



## [0.6.15](https://github.com/brillout/test-e2e/compare/v0.6.14...v0.6.15) (2025-07-28)


### Bug Fixes

* add option `run(cmd, { tolerateError })` ([fc6a5b9](https://github.com/brillout/test-e2e/commit/fc6a5b944a1d477b2d1ec7fe249a2aa7c1f9daea))
* add tolerateError type ([7f47b39](https://github.com/brillout/test-e2e/commit/7f47b39135b0598a340b1c9f90c8422f68202abf))
* remove option `run(cmd, { doNotFailOnWarning: true })` ([16b921e](https://github.com/brillout/test-e2e/commit/16b921ed0d92191f2d2f0e956af4f0b52421eab8))


### BREAKING CHANGES

* use `run(cmd, { tolerateError: true })` instead



## [0.6.14](https://github.com/brillout/test-e2e/compare/v0.6.13...v0.6.14) (2025-06-09)


### Bug Fixes

* set --bail to false by default ([f2c432b](https://github.com/brillout/test-e2e/commit/f2c432b431fdace685ca573edc12bba48c63c8ee))



## [0.6.13](https://github.com/brillout/test-e2e/compare/v0.6.12...v0.6.13) (2025-06-03)


### Bug Fixes

* improve browser error logging ([b174854](https://github.com/brillout/test-e2e/commit/b17485405bc833a70212aeae38781633208379eb))
* minor fix ([c40bd3e](https://github.com/brillout/test-e2e/commit/c40bd3e21350797093425591bacdfb351e8ecf89))



## [0.6.12](https://github.com/brillout/test-e2e/compare/v0.6.11...v0.6.12) (2025-05-22)


### Bug Fixes

* fix assertion ([be48737](https://github.com/brillout/test-e2e/commit/be48737c5ce5d8470a51daf3888b8c5e4a25a157))
* refine bailing ([4eb02f9](https://github.com/brillout/test-e2e/commit/4eb02f9144dcdf90a5c56ba356557168bd8a755e))



## [0.6.11](https://github.com/brillout/test-e2e/compare/v0.6.10...v0.6.11) (2025-05-22)


### Bug Fixes

* apply --bail also upon stderr ([46ed9bf](https://github.com/brillout/test-e2e/commit/46ed9bf616a2299f9feaf1a0c0b741b89d45685e))
* set --bail when run locally ([202fcfa](https://github.com/brillout/test-e2e/commit/202fcfa83a3a1fd415fd4a99438f9572a4748ea1))



## [0.6.10](https://github.com/brillout/test-e2e/compare/v0.6.9...v0.6.10) (2025-05-16)


### Features

* logInfo ([e5bb24f](https://github.com/brillout/test-e2e/commit/e5bb24f07ef59e6f124c61105dd7b9318d5b6fbf))



## [0.6.9](https://github.com/brillout/test-e2e/compare/v0.6.8...v0.6.9) (2025-05-16)


### Bug Fixes

* apply --bail upon browser error ([3b9f2da](https://github.com/brillout/test-e2e/commit/3b9f2da01424532a9e141edfb296a70d98341b01))
* improve browser logs ([1a95a18](https://github.com/brillout/test-e2e/commit/1a95a181f468ab24998eae333f434cc23c360206))



## [0.6.8](https://github.com/brillout/test-e2e/compare/v0.6.7...v0.6.8) (2025-03-29)


### Bug Fixes

* remove validation ([a832722](https://github.com/brillout/test-e2e/commit/a832722eabf587d61eeed0a3ea2d5ee4f6bed859))



## [0.6.7](https://github.com/brillout/test-e2e/compare/v0.6.6...v0.6.7) (2025-03-29)


### Features

* `tolerateError: true` ([faf2027](https://github.com/brillout/test-e2e/commit/faf2027c913c0efcf91412e143639bfdf56a8533))



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



