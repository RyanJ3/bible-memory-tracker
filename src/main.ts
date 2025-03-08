import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify } from 'aws-amplify';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
// In main.ts or dedicated config file

// Amplify.configure({
//   Auth: {
//     region: 'YOUR_REGION',             // e.g., 'us-east-1'
//     userPoolId: 'YOUR_USER_POOL_ID',
//     userPoolWebClientId: 'YOUR_APP_CLIENT_ID'
//   }
// });
