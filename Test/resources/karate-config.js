function fn() {
  var config = {
    baseUrl: 'http://localhost:8080'
  };
  karate.configure('connectTimeout', 10000);
  karate.configure('readTimeout', 10000);
  return config;
}
