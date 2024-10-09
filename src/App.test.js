const { Builder, By, Capabilities } = require("selenium-webdriver");

describe("ProLearning Test", () => {
  let driver;

  beforeAll(() => {
    driver = new Builder()
      .usingServer(`https://prolearning-frontend.vercel.app/login`)
      .withCapabilities(Capabilities.chrome())
      .build();
  });
  
  afterAll(async () => {
    await driver.quit();
  })

  test("local test", async () => {
    await driver.get("https://prolearning-frontend.vercel.app/login");

    expect(await driver.getTitle()).toContain('ProLearning');
  }, 10000000);
});
