import { Component } from '@angular/core';
import { NativeStorage } from "@ionic-native/native-storage";
import { Facebook } from '@ionic-native/facebook';
import { UserPage } from '../user/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  FB_APP_ID: number = 401399156898848;

  constructor(private fb: Facebook, public nativeStorage: NativeStorage) {
    fb.browserInit(this.FB_APP_ID, "v2.8");
  }

  static ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  dbFbLogin() {
    let permissions = new Array();


    permissions = ["public_profile"];

    this.fb.login(permissions)
      .then(function (response) {
          let userId = response.authResponse.userID;
          let params = new Array();

          console.log(response);

          this.fb.api("/me?fields=name,gender", params)
            .then(function (user) {
              user.picture = "https://grapth.facebook.com/" + userId + "/picture?type=large";

              console.log('>>>>>>');
              console.log(user);

              this.nativeStorage.setItem('user',
                {
                  name: user.name,
                  gender: user.gender,
                  picture: user.picture
                })
                .then(function () {
                  this.navController.push(UserPage);
                }, function (error) {
                  console.log(error);
                })
            })
        }, function (error) {
          console.log(error);
        }
      )

  }

}
