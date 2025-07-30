# Firebase Authentication Setup Guide

## 🔥 Firebase Console Configuration

### 1. Authentication Settings

Go to **Firebase Console → Authentication → Settings**

#### Sign-in Methods
Enable the following providers:

**Email/Password:**
- ✅ Enable Email/Password
- ✅ Enable Email link (passwordless sign-in) - Optional
- ❌ Disable Email enumeration protection (for development)

**Google:**
- ✅ Enable Google Sign-in
- Add your project's Web client ID
- Add authorized domains: `localhost`, your production domain

#### Advanced Settings
```
Email enumeration protection: DISABLED (for development)
User account linking: AUTOMATIC
One account per email address: ENABLED
```

### 2. Authorized Domains

Add these domains in **Authentication → Settings → Authorized domains:**
```
localhost
127.0.0.1
your-domain.com (your production domain)
your-app.firebaseapp.com
```

### 3. Templates (Optional)

Configure email templates in **Authentication → Templates:**
- Email address verification
- Password reset
- Email address change

## 🛡️ Firestore Security Rules

If you're using Firestore, add these rules in **Firestore Database → Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Polls - users can create and read polls
    match /polls/{pollId} {
      allow read: if true; // Public polls
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.createdBy;
    }
    
    // Poll responses
    match /responses/{responseId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🔐 Firebase Storage Rules (if needed)

If using Firebase Storage, configure in **Storage → Rules:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public poll images
    match /polls/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## ⚙️ Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🚀 Production Checklist

### Before Going Live:

1. **Enable Email Enumeration Protection**
   - Go to Authentication → Settings
   - Enable "Email enumeration protection"

2. **Configure Password Policy**
   - Set minimum password length (recommended: 8+ characters)
   - Enable password complexity requirements

3. **Set Up Email Verification**
   - Require email verification for new accounts
   - Customize email templates

4. **Rate Limiting**
   - Firebase automatically handles rate limiting
   - Monitor in Firebase Console → Authentication → Usage

5. **Security Rules**
   - Review and tighten Firestore rules
   - Test rules in Firebase Console simulator

## 🔧 Common Issues & Solutions

### Issue: "auth/operation-not-allowed"
**Solution:** Enable the authentication method in Firebase Console

### Issue: "auth/unauthorized-domain"
**Solution:** Add your domain to authorized domains list

### Issue: "auth/popup-blocked"
**Solution:** Ensure popups are allowed for Google sign-in

### Issue: "auth/network-request-failed"
**Solution:** Check internet connection and Firebase configuration

### Issue: "auth/too-many-requests"
**Solution:** Wait or implement exponential backoff

## 📱 Testing Authentication

### Test Cases:
1. ✅ Sign up with email/password
2. ✅ Sign in with email/password
3. ✅ Sign in with Google
4. ✅ Password reset
5. ✅ Email verification
6. ✅ Sign out
7. ✅ Protected route access
8. ✅ Invalid credentials handling

### Development vs Production:

**Development:**
- Disable email enumeration protection
- Use localhost in authorized domains
- Test with real email addresses

**Production:**
- Enable email enumeration protection
- Add production domain to authorized domains
- Enable email verification requirement
- Set up proper error monitoring

## 🎯 Firebase Console Navigation

1. **Authentication Overview:** Monitor sign-ups and active users
2. **Users Tab:** Manage user accounts manually
3. **Sign-in Method:** Configure providers
4. **Templates:** Customize email templates
5. **Settings:** General authentication settings
6. **Usage:** Monitor authentication usage and quotas

Remember to replace placeholder values with your actual Firebase project configuration!