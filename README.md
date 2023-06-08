# PDF Management & Collaboration System

## Getting Started 

1) Install the dependencies: `npm install`
2) Set up the environment variables:
    - Create a .env file in the root directory of the project.
    - Define the following environment variables in the .env file
* PORT = 4000
* MONGODB_URI = <your-mongodb-uri>
* GOOGLE_CLIENT_EMAIL = <your-google-client-email>
* GOOGLE_PRIVATE_KEY = <your-google-private-key>
* GOOGLE_DRIVE_FOLDER_ID = <your-google-drive-folder-id>
* GOOGLE_CLIENT_ID = <your-google-client-id>
* SECRET = <random-Secret-key-for-JWT>

3) `npm start`

## Description

This API allows users to create an account by providing their name, email, and password. Upon successful registration or login, the user will receive a JSON Web Token (JWT), which serves as an authentication token for subsequent requests. The user ID will be extracted from the JWT for performing other activities. 

The name, email and password are stored in MongoDB.The provided password is securely hashed using the `bcrypt` npm package before being stored. The email and password are validate with the help of `express validator`.

All the authenticated user will be able to upload the files. It will stored in google drive and the drive id will be secured in MongoDB. The Authenticated users can view their pdf files and share them with others by provided invite link. The Invited users can also be able to view the pdf and add a comment to it.

## Authorization
The API uses JSON Web Tokens (JWT) for user authentication. To access the protected endpoints, include the Authorization header in your requests with the value: Bearer <token>, where <token> is the JWT obtained during the login process.


## Endpoints:
### User Routes - /api/users

* POST - /register 

    body : {
        name : "**",
        emailId : "--@--.co-",
        password : "***"
    }

    Creates a new user account.

    Returns : JWT upon successful registration.

* POST - /login 
    
    body : {     
        emailId : "--@--.co-",
        password : "***"
    }
    
    Authenticates the user by verifying the provided email and password. 
    Returns : JWT upon successful login.

* POST - /verify
    
    headers : {
        Authorization: "Bearer ${token}"
    }
    
    Verify the provided token is valid or not. 

### File Routes - /api/files
#### Protected 

* POST - /upload
    
    headers : {
        'Content-Type': 'multipart/form-data',
        Authorization: "Bearer ${token}"
    }
    
    Recieve pdf files with content type multipart/form-data in request body and JWT token in header. It store the files in Google drive and store the google drive file id in MongoDB. 
    Returns a success message

* GET - /searchFiles/:name
    
    headers : {     
        Authorization: "Bearer ${token}"
    }
    
    params: {
        page 
    }
    
    Get the details of all the files that match the name with the name provided in the url.
    Returns the list of file detials like fileId, name, uploaded date. Page parameter is used for pagination.

* GET - /getpdf/:fileId
    
    responseType: 'blob',
    
    headers : {     
        Authorization: "Bearer ${token}"
    }
    
    Returns the pdf file that matches the fileId in the url

* GET - /getpdfdetails/:fileId
    
    headers : {     
        Authorization: "Bearer ${token}"
    }
    
    Get the details of the file that matches the fileId with the id provided in the url
    Returns the pdf file details like name, uploaded date , fileId and InviteId

* GET - /getFileComments/:fileId
    
    headers : {     
        Authorization: "Bearer ${token}"
    }
    
    Returns the list of all the comments of the file whose fileId matches with the id in the url

#### Unprotected 

Note: even these routes are unprotected (i.e, doesn't need any JWT token). But it requires InviteId in params

* GET - /getpdfinvite/:fileId
    
    params: {
        inviteId : "**"
    }
    
    Returns the pdf file that matches the fileId in the url after verifying that inviteId matches the inviteId of the respective file.

* GET - /getpdfinvitedetails/:fileId
    
    params: {
        inviteId : "**"
    }
    
    Get the details of the file that matches the fileId with the id provided in the url. Verify that inviteId matches the inviteId of the respective file.
    Returns the pdf file details like name, uploaded date , fileId and InviteId

### Comment Routes - /api/comments

#### Unprotected

* POST - /addComment/:fileId
    
    body: {
        comment : "---" ,
        userName: "---", 
        inviteId : "**"
    }
    
    Checks whether the inviteId matches the inviteId of the respective fileId. Add a new comment with given userName and fileId.
    
    Returns a success message

* GET - /getComments/:fileId
    
    params: {
        inviteId : "**"
    }
    
    Checks whether the inviteId matches the inviteId of the respective fileId.
    
    Returns the list of all the comments of the file whose fileId matches with the id in the url

This is hosted online with the help of  [render.com](https://render.com/)

### Link for this api:
[https://pdfmangementapikarthikeyan.onrender.com](https://pdfmangementapikarthikeyan.onrender.com)

The Frontend part of this web app is hosted on [netlify.com](netlify.com) . Link for the web app is: [https://pdfmanagementkarthikeyan.netlify.app/](https://pdfmanagementkarthikeyan.netlify.app/) 

The source code for frontend - [https://github.com/Karthikeyan-j1112/PdfManagementFrontend.git](https://github.com/Karthikeyan-j1112/PdfManagementFrontend.git)


