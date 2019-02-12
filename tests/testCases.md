## Client
* /utils
  * /auth
    * Signup
      1. If it's email-password signup, set hasPassword to true in DB
      2. If it's social signup, set hasSocialLogin to true in DB
    * Login
      1. If it's email-password signup, set hasPassword to true in DB if it's not already
      2. If it's social signup, set hasSocialLogin to true in DB if it's not already
    * If the user has both email-password and social login, hasPassword and hasSocialLogin should both be true
    * Delete account
      * Deleting user should delete from DB and Auth0 (all related accounts - email-password and social logins)
* /components
  * /common
    * EditableText
      1. If it's not editable, only text should show and "edit" should not be visible
      2. If it's editable, text should turn to Field (with submit and cancel buttons) on click and "edit" should be visible
      3. If Error is thrown on submit, it should display the error message
  * LoginPage
    1. Login fields should validate
    2. Login fields should show proper errors on validation failures
    3. Password errors should be displayed at the same time, not one by one
    4. If Error is thrown on submit, it should display the error message
    5. Google login should work 
    6. On login success, `auth` and `user` should be at in Redux state
    7. Token auto-renewal should work properly
    8. If the user signed up with email-password, Redux `user` state should have hasPassword set to true
    9. If the user signed up with social login, Redux `user` state should have hasSocialLogin set to true
    10. If the user has both email-password and social login, Redux `user` state should have both hasPassword and hasSocialLogin set to true
  * ProfilePage
    * username should not be editable here - only in settings
    * Editable fields should only be editable if the current profile page matches authed user's username
    * email update
      1. Email should only be editable if the user's: 1) hasPassword is true and 2) hasSocialLogin is false
      2. Field should validate for required input and for proper email
      3. Should validate for email availability
      4. Should show proper error message if email is not available
      5. Should show proper error message if submit fails
    * name update
      1. Field should validate for required input
      2. Should show proper error message if submit fails
    * twitter update
      1. If no twitter in user profile, it should show a placeholder text in gray
      2. Field should validate for required input
      3. On submit success, it should display the Twitter icon with link to the profile
      4. Should show proper error message if submit fails
  * SettingsPage
    * username update
      1. Should validate for username availability
      2. Should show proper error message if username is not available
      3. Should show proper error message if submit fails
    * password update
      1. It should only be visible if the user's hasPassword is true
      2. Should only validate if it passes password validations
      3. Should show proper error message if submit fails

## Server
* Resolvers
* /utils
  * /auth
    * updateUserInAuth0()
      * If the update includes email or password, it should update both DB and Auth0
      * If the update includes email:
        1. The user cannot have social login (since it can't be updated) - throw
        2. TODO: If the email has any capitalization, email search for update should use lowercase for Auth0 and unchanged for social login. Save unaltered in DB
      * If the update includes password:
        1. Update only Auth0 account in Auth0, but don't touch the social logins
        2. 
