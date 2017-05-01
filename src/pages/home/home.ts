import { Component, ViewChild } from '@angular/core';
import { LoadingController, ActionSheetController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
import { InAppBrowser } from 'ionic-native';
import { RedditService } from '../../providers/reddit-service';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public feeds: Array<any>;
  private url: string = "https://www.reddit.com/new.json";
  private olderPosts: string = "https://www.reddit.com/new.json?after=";
  private newerPosts: string = "https://www.reddit.com/new.json?before=";

  public hasFilter: boolean = false;
  public noFilter: Array<any>;
  public searchTerm: string = "";

  @ViewChild(Content) content: Content;

  userProfile: any = null;

  constructor(public http: Http, public loadingController: LoadingController,
              public actionSheetController: ActionSheetController, public redditService: RedditService,
  private facebook: Facebook) {

    this.fetchContent();

  }

  facebookLogin(): void {
    this.facebook.login(['login']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential).then((success) => {
        console.log("Firebase success: " + JSON.stringify(success));
        this.userProfile = success;
      })
        .catch((error) => {
        console.log("Firebase failure: " + JSON.stringify(error));
        });
    }).catch((error) => {
      console.log(error);
    });
  }

  fetchContent(): void {
    let loading = this.loadingController.create({
      content: 'Carregando conteúdo...'
    });

    loading.present();

    this.redditService.fetchData(this.url).then(data => {
      this.feeds = data;
      this.noFilter = this.feeds;
      loading.dismiss();
    })

  }

  itemSelected(url: string): void {
    new InAppBrowser(url, '_system');
  }

  doInfinite(infiniteScroll) {
    let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : "";

    this.http.get(this.olderPosts + paramsUrl).map(res => res.json())
      .subscribe(data => {
        this.feeds = this.feeds.concat(data.data.children);

        this.feeds.forEach((e, i, a) => {
          if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1) {
            e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
          }
        });

        this.noFilter = this.feeds;
        this.hasFilter = false;

        infiniteScroll.complete();

      })
  }

  doRefresh(refresher) {

    let paramsUrl = this.feeds[0].data.name;

    this.http.get(this.newerPosts + paramsUrl).map(res => res.json())
      .subscribe(data => {

        this.feeds = data.data.children.concat(this.feeds);

        this.feeds.forEach((e, i, a) => {
          if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1) {
            e.data.thumbnail = 'http://www.redditstatic.com/icon.png';
          }
        });

        this.noFilter = this.feeds;
        this.hasFilter = false;

        refresher.complete();

      });
  }

  showFilters(): void {

    this.content.scrollToTop();

    let actionSheet = this.actionSheetController.create({
      title: 'Opções de filtro:',
      buttons: [
        {
          text: 'Música',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "music");
            this.hasFilter = true;
          }
        },
        {
          text: 'Filmes',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "movies");
            this.hasFilter = true;
          }
        },
        {
          text: 'Jogos',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "games");
            this.hasFilter = true;
          }
        },
        {
          text: 'Fotos',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "pics");
            this.hasFilter = true;
          }
        },
        {
          text: 'Limpar',
          role: 'cancel',
          handler: () => {
            this.feeds = this.noFilter;
            this.hasFilter = false;
          }
        }
      ]
    });

    actionSheet.present();

  }

  filterItems() {
    this.hasFilter = false;
    this.feeds = this.noFilter.filter((item) => {
      return item.data.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

}
