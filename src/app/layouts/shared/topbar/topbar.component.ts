import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { cartData } from 'src/app/utils';
import { CartModel } from '../../../interfaces/topbar.interfaces';
import { LanguageService } from '../../../services/language.service';
import { EventService } from '../../../services/event.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { logout } from 'src/app/redux/actions/auth.action';
import { STORAGE_REMEMBER_ME } from 'src/app/constants/storage.constants';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  cartData: CartModel[] = cartData;
  total = 0;
  cart_length: any = 0;

  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData = {
    first_name: '',
    last_name: '',
    role: ''
  };

   /***
   * Language Listing
   */
   listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Española', flag: 'assets/images/flags/spain.svg', lang: 'es' },
    { text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'de' },
    { text: 'Italiana', flag: 'assets/images/flags/italy.svg', lang: 'it' },
    { text: 'русский', flag: 'assets/images/flags/russia.svg', lang: 'ru' },
    { text: '中国人', flag: 'assets/images/flags/china.svg', lang: 'ch' },
    { text: 'français', flag: 'assets/images/flags/french.svg', lang: 'fr' },
    { text: 'Arabic', flag: 'assets/images/flags/ar.svg', lang: 'ar' },
  ];

  constructor(
    @Inject(DOCUMENT) private document: any,
    public languageService: LanguageService,
    private  eventService: EventService,
    private _storageService: LocalStorageService,
    private _authServive: AuthService,
    private _router: Router,
    private _store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  oncheckboxchange(evnt: any) {
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  // Search Topbar
  Search() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById("search-options") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add("show");
      searchOptions.classList.remove("d-none");
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName("notify-item");

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = ''
        if (element.querySelector("h6")) {
          var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase()
          var name = element.querySelector("h6").innerText.toLowerCase()
          if (name.includes(inputVal)) {
            notifiTxt = name
          } else {
            notifiTxt = spantext
          }
        } else if (element.getElementsByTagName("span")) {
          notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase()
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal) ? "block" : "none";

      });
    } else {
      dropdown.classList.remove("show");
      searchOptions.classList.add("d-none");
    }
  }

  // Delete Item
  deleteItem(event: any, id: any) {
    var price = event.target.closest('.dropdown-item').querySelector('.item_price').innerHTML;
    var Total_price = this.total - price;
    this.total = Total_price;
    this.cart_length = this.cart_length - 1;
    this.total > 1 ? (document.getElementById("empty-cart") as HTMLElement).style.display = "none" : (document.getElementById("empty-cart") as HTMLElement).style.display = "block";
    document.getElementById('item_' + id)?.remove();
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    dropdown.classList.remove("show");
    searchOptions.classList.add("d-none");
    searchInputReponsive.value = "";
  }

  /**
  * Topbar Light-Dark Mode Change
  */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);

    switch (mode) {
      case 'light':
        document.body.setAttribute('data-layout-mode', "light");
        document.body.setAttribute('data-sidebar', "light");

        break;
      case 'dark':
        document.body.setAttribute('data-layout-mode', "dark");
        document.body.setAttribute('data-sidebar', "dark");
        break;
      default:
        document.body.setAttribute('data-layout-mode', "light");
        break;
    }
  }

  windowScroll() {
    try {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        (document.getElementById('back-to-top') as HTMLElement).style.display = "block";
      } else {
        (document.getElementById('back-to-top') as HTMLElement).style.display = "none";
      }
    } catch (error) {
      console.warn('Error to windowScroll', error);
    }
  }

  logout() {
    const rememberMe = this._authServive.getRememberMe();
    const user = this._authServive.getUserData();
    this._storageService.clear();
    if(rememberMe && user) {
      this._authServive.setUserData(user);
      this._authServive.setRememberMe(rememberMe);
    }
    this._store.dispatch(logout());
    this._router.navigate(['/auth']);
  }

  loadUserData() {
    this._store.pipe(select(state => state.auth)).subscribe(resp => {
      const { user, roles } = resp;
      this.userData = {
        first_name: user?.nombre ?? '',
        last_name: user?.apellido ?? '',
        role: roles?.join(' - ')
      }     
    });
  }

}
