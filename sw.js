// 복싱 트레이너는 배움퀘스트(levelplay)로 이사했습니다.
// 예전 기기에 남은 서비스워커를 스스로 지우는 파일입니다.
// 방식: NekR/self-destroying-sw (install -> skipWaiting, activate -> unregister -> 열린 창 이동)
// 추가 1: 이 앱 이름의 캐시(boxing-trainer-v*)만 지웁니다. 같은 주소를 쓰는 다른 앱(배움퀘스트 등)의 캐시는 건드리지 않습니다.
// 추가 2: 열린 창은 새로고침 대신 배움퀘스트 주소로 바로 보냅니다(안내판을 한 번 더 거치지 않게).
var OWN = /^boxing-trainer-v\d+(?:-[0-9a-z]+)*$/;
var TO = 'https://bsy522-dot.github.io/levelplay/games/boxing-trainer-v5.html';
self.addEventListener('install', function () {
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return OWN.test(k); }).map(function (k) { return caches.delete(k); }));
      })
      .catch(function () {})
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) {
        clients.forEach(function (c) {
          try { if (c.navigate) c.navigate(TO).catch(function () {}); } catch (err) {}
        });
      })
      .catch(function () {})
  );
});
