import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {Push, PushToken} from '@ionic/cloud-angular';
import {NativeStorage} from "ionic-native";
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public push: Push) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      //splashScreen.hide();

      NativeStorage.getItem('user')
        .then(function (data) {
            this.nav.push(UserPage);
            splashScreen.hide();
          },
          function (error) {
            this.nav.push(LoginPage);
            splashScreen.hide();
          });

      statusBar.styleDefault();

      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token salvo: ', t.token);
      });

      this.push.rx.notification()
        .subscribe((msg) => {
          console.log('Eu recebi uma notificação push: ' + msg);
        });

    });
  }
}
