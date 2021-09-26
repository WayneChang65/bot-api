## bot-api
針對TosMM以及PokeMM這兩個機器人的狀態提供讀取窗口。

### API 規畫
* tosmm
    * [x] status
        * {isalive: true, online: 'OFFLINE'}
    * [ ] statistics
        * [x] groups
            * {counts: 123, active: 100}
        * [x] users
            * {counts: 12345, active: 11111}
        * [ ] toro
            * [ ] tos
            * [ ] tg
            * [ ] tb
            * [ ] kuzi
    * toro
        * [x] tg
        * [ ] tb
        * [ ] kuzi
        * [ ] tos

#### api/tosmm/status
#### api/tosmm/statistics/groups
#### api/tosmm/statistics/users
#### api/tosmm/statistics/toro/tos
#### api/tosmm/statistics/toro/tg
#### api/tosmm/statistics/toro/tb
#### api/tosmm/statistics/toro/kuzi
#### api/tosmm/toro/tg

* pokedc
    * [x] status
        * {isalive: true, online: 'ONLINE'}
    * [x] statistics
        * [x] users
            * {counts: 1234}
#### api/pokedc/status
#### api/pokedc/statistics/users

* crawler  
#### api/crawler/sm  
#### api/crawler/idb  
#### api/crawler/pmc  
