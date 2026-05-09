# Workflow for Testers

## 1. Guide: Tester review dev code.

This guide covers the verification process from receiving a "Needs Review" notification to final approval.

| Step | Action | Description & Commands |
| :--- | :--- | :--- |
| **1. Fetch** | Get the branch | Pull the developer's branch to your local machine for testing.<br>`git fetch origin`<br>`git checkout feature/12-login-auth` |
| **2. Test** | Verify Logic | Run automated tools, linters, or manual tests as required for the feature. |
| **3. Review** | Give Feedback | On GitHub PR -> **Files changed** tab:<br>- **Bug found:** Comment on the specific line and select **Request Changes**.<br>- **Fixed:** Resolve the conversation once the dev pushes new code. |
| **4. Approve** | Final Sign-off | When the feature meets all requirements:<br>1. Change **Label** to `QA Passed`.<br>2. Click **Review changes** -> **Approve**. |

## 2. Emergency Hotfix Workflow

| Step | Action | Description & Commands |
| :--- | :--- | :--- |
| **1. Priority** | Drop Current Tasks | Hotfixes take the highest priority. Start testing immediately. |
| **2. Fetch** | Checkout Hotfix | Get the emergency code.<br>`git fetch origin`<br>`git checkout hotfix/15-fix-crash` |
| **3. Verify** | Regression Test | 1. Verify the fix for Issue #15.<br>2. Perform a quick check on related features to ensure no side effects. |
| **4. Approve** | Fast-Track Sign-off | On GitHub PR:<br>1. Add label `QA Passed`.<br>2. Click **Review changes** -> **Approve**. |