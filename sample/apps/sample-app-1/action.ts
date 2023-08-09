const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  sleep(1000);
  console.log('Hello World');
  sleep(1000);
})();
