import { test } from "@playwright/test"
import { MyAccountPage } from "../page-objects/MyAccount"
import { getLoginToken } from "../api-calls/getLoginToken"
import { adminDetails } from "../data/userDetails"


test("My account using cookie injection and mocking network request", async ({page}) => {
    //make a request for login token
    const loginToken = await getLoginToken(adminDetails.username, adminDetails.password)

    await page.route("**/api/user**", async (route, request) => {
        await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({message: "PLAYWRIGHT ERROR FROM MOCKING"})
        })
    })

    const myAccount = new MyAccountPage(page)    
    await myAccount.visit()
    //inject token into browser
    await page.evaluate(([loginTokenInner]) => {
        document.cookie = "token=" + loginTokenInner
    }, [loginToken])
    await myAccount.visit()
    await myAccount.waitForPageHeading()
    await myAccount.waitForErrorMessage()
})