import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/en'
import { PASSWORD, USERNAME } from '../../config/env-data'

let loginPage: LoginPage

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  await loginPage.open()
})

test('signIn button disabled when incorrect data inserted', async ({}) => {
  await loginPage.usernameField.fill(faker.lorem.word(2))
  await loginPage.passwordField.fill(faker.lorem.word(7))
  await expect(loginPage.signInButton).toBeDisabled()
})

test('error message displayed when incorrect credentials used', async ({}) => {
  await loginPage.usernameField.fill(faker.lorem.word(2))
  await loginPage.passwordField.fill(faker.lorem.word(9))
  await loginPage.signInButton.click()
  await expect(loginPage.authError).toBeVisible()
})

test('login with correct credentials and verify order creation page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  await expect(orderCreationPage.statusButton).toBeVisible()
  await expect(orderCreationPage.userNameInput).toBeVisible()
  await expect(orderCreationPage.phoneInput).toBeVisible()
  await expect(orderCreationPage.commentInput).toBeVisible()
  await expect(orderCreationPage.createOrderButton).toBeVisible()
})

test('login and create order', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  // let's create an order
  await orderCreationPage.userNameInput.fill('random-user')
  await orderCreationPage.phoneInput.fill('555555555')
  await orderCreationPage.commentInput.fill('Hei!')
  await orderCreationPage.createOrderButton.click()

  await expect(orderCreationPage.successMessage).toBeVisible()
})

test('check error on order creation', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  // let's create an order
  await orderCreationPage.userNameInput.fill('a')
  await orderCreationPage.phoneInput.fill('12345')
  await orderCreationPage.commentInput.fill('Hei!')

  await expect(orderCreationPage.createOrderButton).toBeDisabled()

  await expect(orderCreationPage.customerNameError).toBeVisible()
  await expect(orderCreationPage.phoneError).toBeVisible()
})

test('checklogout from order page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  // let's create an order
  await orderCreationPage.logOutButton.click()

  await expect(loginPage.signInButton).toBeVisible()

  console.log(loginPage.page.url())
})

test('order not found page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  // let's create an order
  await orderCreationPage.statusButton.click()

  await orderCreationPage.searchOrderInput.fill('25999')
  await orderCreationPage.searchOrderButton.click()

  await expect(orderCreationPage.orderNotFoundText).toBeVisible()
  await expect(orderCreationPage.orderNotFoundImage).toBeVisible()
})

test('order found page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  // let's create an order
  await orderCreationPage.statusButton.click()

  await orderCreationPage.searchOrderInput.fill('20621')
  await orderCreationPage.searchOrderButton.click()

  await expect(orderCreationPage.orderStatusOpen).toBeVisible()
  await expect(orderCreationPage.orderNameDetails).toBeVisible()
})
