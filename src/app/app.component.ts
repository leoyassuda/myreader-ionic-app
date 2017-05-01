import { Component } from "@angular/core";
import { NavController, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Push, PushToken } from "@ionic/cloud-angular";
import { HomePage } from "../pages/home/home";
import firebase from 'firebase'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public push: Push,
    navController: NavController) {

    //https://my-reader-app.firebaseapp.com/__/auth/handler
    firebase.initializeApp({
      apiKey: "AIzaSyAz43ZmWowYCIunfEYm7s6A1Xvg6F9EAhU",
      authDomain: "",
      databaseURL: "",
      storageBucket: "",
      messagingSenderId: ""
    });

    platform.ready().then(() => {

      // this.nativeStorage.getItem('user')
      //   .then(function (data) {
      //       navController.push(UserPage);
      //       splashScreen.hide();
      //     },
      //     function (error) {
      //       navController.push(LoginPage);
      //       splashScreen.hide();
      //     });

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

      splashScreen.hide();

    });
  }
}
