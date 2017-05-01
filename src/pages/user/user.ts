import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from "@ionic-native/native-storage";
import { LoginPage } from '../login/login'

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})

export class UserPage {

  user: any;
  userReady: boolean = false;

  constructor(public navParams: NavParams, private nativeStorage: NativeStorage,
    private fb: Facebook) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
    let env = this;
    this.nativeStorage.getItem('user')
      .then(function (data) {
        env.user = {
          name: data.name,
          gender: data.gender,
          picture: data.picture
        };
        env.userReady = true;
      }, function (error) {
        console.log(error);
      });
  }

  doFbLogout(){
    // let nav = this.navCtrl;
    // this.fb.logout()
    //   .then(function (response) {
    //     this.nativeStorage.remove('user');
    //     nav.push(LoginPage);
    //   }, function (error) {
    //     console.log(error);
    //   });
  }

}
