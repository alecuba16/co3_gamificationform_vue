<template>
  <div id="app">
    <section class="header">
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" />
      <link
        rel="stylesheet"
        href="https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css"
      />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <div class="header-body" style="padding: 1rem 0">
        <div class="container">
          <div class="columns">
            <div class="column is-6" style="display: flex; align-items: center;">
              <div class="is-pulled-left">
                <img width="350px" src="@assets/logo.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top: .5rem">
      <b-loading :active.sync="isLoading">
        <b-icon pack="fas" icon="sync-alt" size="is-large" custom-class="fa-spin"></b-icon>
      </b-loading>
      <div class="container">
        <b-field position="is-right">
          <b-select
            placeholder="Language"
            icon="language"
            v-model="lang"
            @input="(e)=>changedLanguage(e,true)"
          >
            <option value="en">English</option>
            <option value="it">Italiano</option>
            <option value="el">ελληνικά</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </b-select>
        </b-field>
        <b-progress
          :value="percentage"
          show-value
          format="percent"
          size="is_small"
          :keep-trailing-zeroes="false"
        ></b-progress>

        <div class="columns">
          <div class="column is-8 is-offset-2">
            <horizontal-stepper
              ref="horizontalstepper"
              :steps="steps"
              :locale="lang"
              :keep-alive="true"
              @completed-step="completeStep"
              :top-buttons="false"
              @active-step="isStepActive"
              @stepper-finished="finishedStepper"
              :disableBack="true"
              :formData="formData"
            ></horizontal-stepper>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <img width="350px" src="@assets/european_community_funded.svg" />
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from "vue";
import HorizontalStepper from "vue-stepper";
import axios from "axios";
import Introduction from "./components/Introduction.vue";
import Results from "./components/Results.vue";
import { DeviceUUID } from "device-uuid";
import DiscoverYourProfile from "./components/DiscoverYourProfile.vue";
import WhatYouPlay from "./components/WhatYouPlay.vue";
import {
  localhostProxiedGoogleSheetUrl,
  proxiedIpGeoUrl,
  JSONSERVER_VISIT_COLLECTION,
  JSONSERVER_URL,
  proxiedGoogleSheetUrl,
  finishRedirectUrl,
  JSONSERVER_API_KEY,
  JSONSERVER_DATA_COLLECTION,
  JSONSERVER_ERROR_COLLECTION
} from "@assets/constants.js";
var du = new DeviceUUID().parse();
var dua = [
  du.language,
  du.platform,
  du.os,
  du.cpuCores,
  du.isAuthoritative,
  du.silkAccelerated,
  du.isKindleFire,
  du.isDesktop,
  du.isMobile,
  du.isTablet,
  du.isWindows,
  du.isLinux,
  du.isLinux64,
  du.isMac,
  du.isiPad,
  du.isiPhone,
  du.isiPod,
  du.isSmartTV,
  du.pixelDepth,
  du.isTouchScreen
];
var uuid = du.hashMD5(dua.join(":"));
//const isProduction=true;
const isProduction =
  process != null &&
  process.env != null &&
  process.env.NODE_ENV != null &&
  process.env.NODE_ENV != "production"
    ? false
    : true;

var errorSender = function(error){
    var xmlhttp = new XMLHttpRequest();
    var url=JSONSERVER_URL+"/"+JSONSERVER_ERROR_COLLECTION;
    console.log(JSONSERVER_API_KEY);
    xmlhttp.open('POST', JSONSERVER_URL+"/"+JSONSERVER_ERROR_COLLECTION, true);
    xmlhttp.setRequestHeader('x-api-key', JSONSERVER_API_KEY);
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(error));
}

 window.onerror = function(msg, url, line)
  {
    var error = {
      error: "Error in " + url + " line: " + line+" , msg:"+msg+" , user agent:"+navigator.userAgent,
      testing: !isProduction
    };
     var xmlhttp = new XMLHttpRequest();
    var url=JSONSERVER_URL+"/"+JSONSERVER_ERROR_COLLECTION;
    console.log(JSONSERVER_API_KEY);
    xmlhttp.open('POST', JSONSERVER_URL+"/"+JSONSERVER_ERROR_COLLECTION, true);
    xmlhttp.setRequestHeader('x-api-key', JSONSERVER_API_KEY);
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(error));
  }

Vue.config.errorHandler = function(err, vm, info) {
  var headers = {
    "Content-Type": "application/json",
    "x-api-key": JSONSERVER_API_KEY,
    private: "true"
  };
  console.log(err);
  if (isProduction) {
    var error = {
      error: "[Global Error Handler]: Error in " + info + ": " + err,
      testing: !isProduction
    };
    axios
      .post(JSONSERVER_URL+"/"+JSONSERVER_ERROR_COLLECTION, JSON.stringify(error), {
        headers: headers
      })
      .then(res => {
        console.log(
          res.status==200
            ? "JSONSERVER:created error bin"
            : "JSONSERVER:failed to create error bin:" + res.data
        );
      })
      .catch(err => {
        errorSender({
          error: "JSONSERVER:failed to create error bin:" + err +", user agent:"+navigator.userAgent,
          testing: !isProduction
        });
        console.log("JSONSERVER:failed to create error bin:" + err);
      });
  }
};

const title = {
  en: {
    introduction: "Introduction",
    whatyouplay: "What you play",
    discoveryourprofile: "Discover your gamer profile",
    results: "Results"
  },
  it: {
    introduction: "Introduction",
    whatyouplay: "What you play",
    discoveryourprofile: "Discover your gamer profile",
    results: "Results"
  },
  el: {
    introduction: "Introduction",
    whatyouplay: "What you play",
    discoveryourprofile: "Discover your gamer profile",
    results: "Results"
  },
  fr: {
    introduction: "Introduction",
    whatyouplay: "What you play",
    discoveryourprofile: "Discover your gamer profile",
    results: "Results"
  },
  es: {
    introduction: "Introducción",
    whatyouplay: "¿A qué juegas?",
    discoveryourprofile: "Descubre tu perfil de jugador",
    results: "Resultados"
  }
};

var defaultlang =
  navigator.language &&
  ["en", "it", "el", "fr"].indexOf(navigator.language) > -1
    ? navigator.language
    : "en";

var date = new Date();
var dateStr =
  ("0" + date.getUTCFullYear()).slice(-2) +
  "/" +
  ("0" + (date.getUTCMonth() * 1 + 1)).slice(-2) +
  "/" +
  ("0" + date.getUTCDate()).slice(-2) +
  " " +
  ("0" + date.getUTCHours()).slice(-2) +
  ":" +
  ("0" + date.getUTCMinutes()).slice(-2) +
  ":" +
  ("0" + date.getUTCSeconds()).slice(-2);
export default {
  name: "app",
  props: ["clickedNext", "currentStep"],
  components: {
    HorizontalStepper
  },
  data() {
    return {
      alreadyParticipated: {
        en:
          "You have already participated, the new data is discarded. <br> Your unique ID is:",
        it:
          "Hai già partecipato, i nuovi dati vengono scartati.  Il tuo ID univoco è:",
        el:
          "Έχετε ήδη συμμετάσχει, τα νέα δεδομένα απορρίπτονται. <br> Το μοναδικό σας αναγνωριστικό είναι:",
        fr:
          "Vous avez déjà participé, les nouvelles données sont supprimées. <br> Votre ID unique est :"
      },
      submittedSucessfully: {
        en: "The form was saved successfully, thanks for participating.",
        it:
          "Il modulo è stato salvato con successo, grazie alla partecipazione.",
        el: "Η φόρμα αποθηκεύτηκε με επιτυχία, ευχαριστώ που συμμετείχατε.",
        fr:
          "Le formulaire a été sauvegardé avec succès, merci de votre participation."
      },
      isLoading: false,
      lang: defaultlang,
      percentage: 0,
      ipGeolocationInfo: null,
      langSelected: false,
      steps: [
        {
          icon: "info",
          name: "introduction",
          title: this.getLocalizedTitle("introduction", defaultlang),
          subtitle: "",
          component: Introduction,
          completed: false
        },
        {
          icon: "videogame_asset",
          name: "whatyouplay",
          title: this.getLocalizedTitle("whatyouplay", defaultlang),
          subtitle: "",
          component: WhatYouPlay,
          completed: false
        },
        {
          icon: "category",
          name: "discoveryourprofile",
          title: this.getLocalizedTitle("discoveryourprofile", defaultlang),
          subtitle: "",
          component: DiscoverYourProfile,
          completed: false
        },
        {
          icon: "poll",
          name: "results",
          title: this.getLocalizedTitle("results", defaultlang),
          subtitle: "",
          component: Results,
          completed: true
        }
      ],
      activeStep: 0,
      formData: {},    
      testing: !isProduction,
      macroUrl: isProduction
        ? proxiedGoogleSheetUrl
        : localhostProxiedGoogleSheetUrl
    };
  },
  watch: {
    clickedNext(val) {
      console.log("Clicked next", val);
    }
  },
  created: function() {
    var self = this;
    axios
      .get(proxiedIpGeoUrl)
      .then(res => {
        if (res.status == 200 && !self.langSelected) {
          var regexJson = /({.*})/gi;
          var matchedJson = regexJson.exec(res.data.contents);
          if (
            matchedJson != null &&
            matchedJson != undefined &&
            matchedJson.length > 0
          ) {
            var data = JSON.parse(matchedJson[1]);
            switch (data.countryCode.toLowerCase()) {
              case "it":
                self.lang = "it";
                break;
              case "gr":
                self.lang = "el";
                break;
              case "fr":
                self.lang = "fr";
                break;
              case "es":
                self.lang = "es";
                break;
              default:
                self.lang = "en";
                break;
            }
            self.ipGeolocationInfo = data;
            self.changedLanguage(self.lang, false);
          }
        }
        self.addVisit();
      })
      .catch(err => {
        errorSender({
          error: "ip-api.com error:" + err +", user agent:"+navigator.userAgent,
          testing: !isProduction
        });
        self.addVisit();
        console.log("ip-api.com error:" + err);
      });
  },
  methods: {
    addVisit() {
      var submitData = {
        uuid: uuid,
        form_version: "v4",
        ipGeolocationInfo: this.ipGeolocationInfo,
        form_language: this.lang,
        co3_form_open_log: true,
        testing: this.testing,
        timestamp: dateStr,
        navigator: du
      };
      var headers = {
        "Content-Type": "application/json"
      };
      if (this.testing != null && this.testing != undefined && !this.testing) {
        axios
          .post(this.macroUrl, submitData, { headers: headers })
          .catch(err => {
            console.log(err);
          });
        headers = {
          "Content-Type": "application/json",
          "x-api-key": JSONSERVER_API_KEY,
          private: "true"
        };
        axios
          .post(JSONSERVER_URL+"/"+JSONSERVER_VISIT_COLLECTION, JSON.stringify(submitData), {
            headers: headers
          })
          .then(res => {
            console.log(
              res.status==200
                ? "JSONSERVER:created visit bin"
                : "JSONSERVER:failed to create visit bin:" + res.data
            );
          })
          .catch(err => {
            errorSender({
            error: "JSONSERVER:failed to create visit bin:" + err +", user agent:"+navigator.userAgent,
            testing: !isProduction
            });
            console.log("JSONSERVER:failed to create visit bin:" + err);
          });
      }
    },
    getLocalizedBase(variable, lang) {
      return variable.hasOwnProperty(lang)
        ? variable[lang]
        : variable[Object.keys(variable)[0]];
    },
    getLocalizedAlreadyParticipated(lang) {
      return this.getLocalizedBase(this.alreadyParticipated, lang);
    },
    getLocalizedSubmittedSucessfully(lang) {
      return this.getLocalizedBase(this.submittedSucessfully, lang);
    },
    getLocalizedTitle(step, lang) {
      return title[lang][step];
    },
    changedLanguage(e, manual) {
      this.langSelected = manual ? true : false;
      Object.keys(this.steps).forEach(k => {
        this.steps[k].title = this.getLocalizedTitle(this.steps[k].name, e);
      });
      this.$eventHub.$emit("changedLanguage", e);
    },
    gotoWebSite() {
      window.location.href = finishRedirectUrl;
    },
    completeStep(payload) {
      if (payload != null) {
        var self = this;
        this.steps.forEach((step, key) => {
          if (step.name === payload.name) {
            self.percentage = Math.round(((key + 2) * 100) / self.steps.length);
            self.prepareColumnData(self, payload.formData);
            step.completed = true;
            if (key == self.steps.length - 2) {
              //special case for form.
              self.prepareAndSubmit(self.formData);
            }
          }
        });
      }
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },
    isStepActive(payload) {
      this.steps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
      this.childValidations();
    },
    showNotification(isError, msg) {
      this.$buefy.notification.open({
        duration: 5000,
        message: msg,
        position: "is-bottom-right",
        type: isError ? "is-danger" : "is-warning",
        hasIcon: true
      });
    },
    isArray(a) {
      return !!a && a.constructor === Array;
    },
    isObject(a) {
      return !!a && a.constructor === Object;
    },
    isEmpty(a) {
      return Object.keys(a).length === 0 && a.constructor === Object;
    },
    recursiveArrayFlatten(a) {
      var self = this;
      if (self.isArray(a)) {
        var tmp = [];
        if (a.length > 0) {
          a.forEach(function(e) {
            var res = self.recursiveArrayFlatten(e);
            if (self.isArray(res)) {
              tmp = tmp.concat(res);
            } else {
              tmp.push(res);
            }
          });
          return tmp;
          //return a.forEach((e)=>self.recursiveArrayFlatten(e));
        } else {
          return tmp;
        }
      } else if (a != null && !self.isEmpty(a)) {
        if (self.isObject(a)) {
          if (a.hasOwnProperty("key")) {
            return a.key;
          } else {
            return Object.keys(a).reduce(function(r, k) {
              return r.concat(a[k] != null ? a[k].toLowerCase() : a[k]);
            }, []);
          }
        } else {
          return a;
        }
      }
    },
    finishedStepper() {
      console.log("Finished");
      this.gotoWebSite();
    },
    childValidations() {
      var self = this;
      if (self.$refs) {
        Object.keys(self.$refs).forEach(k => {
          if (
            self.$refs[k].hasOwnProperty("$v") &&
            self.$refs[k].$v != null &&
            self.$refs[k].$v != undefined &&
            self.$refs[k].$v.hasOwnProperty("$touch")
          ) {
            self.$refs[k].$v.$touch();
          }
        });
      }
    },
    prepareAndSubmit(payload) {
      console.log("submitting form");
      this.isLoading = true;
      var self = this;
      this.prepareColumnData(this, payload.formData);

      var submitData = {
        uuid: uuid,
        form_language: this.lang,
        form_version: "v4",
        testing: this.testing,
        timestamp: dateStr
      };
      var tmp;
      tmp = JSON.parse(JSON.stringify(self.formData));
      Object.keys(tmp).forEach(function(idx) {
        submitData[idx] = tmp[idx];
      });

      var headers = {
        "Content-Type": "application/json",
        "x-api-key": JSONSERVER_API_KEY,
        private: "true"
      };

      axios
        .post(JSONSERVER_URL+"/"+JSONSERVER_DATA_COLLECTION, JSON.stringify(submitData), {
          headers: headers
        })
        .then(res => {
          self.isLoading = false;
          var result = res.status==200;
          if (result) {
            console.log("JSONSERVER:created bin");
            if (self.isProduction)
              window.location.href = "https://www.projectco3.eu";
          } else {
            console.log(
              "JSONSERVER:failed to create data bin:" + res.data
            );
          }
        })
        .catch(err => {
          errorSender({
            error: "JSONSERVER:failed to create visit bin:" + err +", user agent:"+navigator.userAgent,
            testing: !isProduction
          });
          console.log("JSONSERVER:failed to create data bin:" + err);
        });

      // headers = {
      //   "Content-Type": "application/json"
      // };
      //   axios
      //     .post(this.macroUrl, submitDataFlatten, { headers: headers })
      //     .then(response => {
      //       self.isLoading = false;
      //       if (response.status == 200) {
      //         self.percentage = 100;
      //         var response_status = 200;
      //         var response_msg = "ok";
      //         if (
      //           response.data.hasOwnProperty("contents") &&
      //           response.data.contents != null &&
      //           response.data.contents != {} &&
      //           response.data.contents.toLowerCase().includes("application/json")
      //         ) {
      //           var regexStatus = /{.*"status" ?: ?([0-9]{3})[ |,|}].*}/gi;
      //           var regexMsg = /{.*"msg" ?: ?"(.*)".*}/gi;
      //           var matchedStatus = regexStatus.exec(response.data.contents);
      //           if (
      //             matchedStatus != null &&
      //             matchedStatus != "" &&
      //             matchedStatus.length > 1
      //           ) {
      //             response_status = matchedStatus[1];
      //           }
      //           var matchedMsg = regexMsg.exec(response.data.contents);
      //           if (
      //             matchedMsg != null &&
      //             matchedMsg != "" &&
      //             matchedMsg.length > 1
      //           ) {
      //             response_msg = matchedMsg[1];
      //           }
      //         } else {
      //           response_status = response.data.status;
      //         }
      //         if (response_status == 200) {
      //           console.log("All OK");
      //           // self.$buefy.dialog.alert({
      //           //   message: self.getLocalizedSubmittedSucessfully(self.lang),
      //           //   onConfirm: self.gotoWebSite
      //           // });
      //         } else if (response_status == 409) {
      //           // this.$buefy.dialog.alert({
      //           //   title: "Warning",
      //           //   message:
      //           //     self.getLocalizedAlreadyParticipated(self.lang) + " " + uuid,
      //           //   type: "is-warning",
      //           //   hasIcon: true,
      //           //   icon: "times-circle",
      //           //   iconPack: "fa",
      //           //   onConfirm: self.gotoWebSite
      //           // });
      //           console.log(response_msg);
      //         } else {
      //           console.log(
      //             "Unknown response.data" + JSON.stringify(response.data)
      //           );
      //         }
      //       } else {
      //         this.$buefy.dialog.alert({
      //           title: "Error",
      //           message: response.error,
      //           type: "is-danger",
      //           hasIcon: true,
      //           icon: "times-circle",
      //           iconPack: "fa"
      //         });
      //         console.log("Error");
      //       }
      //     })
      //     .catch(err => {
      //       self.isLoading = false;
      //       self.error = err;
      //       console.log(err);
      //     });
    },
    prepareColumnData(self, data) {
      for (var prop in data) {
        self.formData[prop] = data[prop];
      }
      // if (Object.prototype.hasOwnProperty.call(self.formData, prop)) {
      //   self.formData[prop] = data[prop];
      // } else {
      //   self.formData[prop] = data[prop];
      // }
    }
  }
};
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.footer {
  background-color: #242424;
}

.pointer {
  cursor: pointer;
}

h1,
h2 {
  font-weight: normal;
}

hr {
  background-color: transparent;
  border: none;
  display: block;
  height: inherit;
  margin: 1.5rem 0;
  border-top: dashed 1px;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #0b99b9;
  text-decoration: underline;
}

.text-medium-grey {
  color: #333;
}

.text-light-grey {
  color: #888;
}

.box.formated {
  position: relative;
  padding: 0;
}

.box.formated .heading {
  font-size: 1rem;
  text-transform: capitalize;
  padding: 0.8rem 1.5rem;
  background-color: #fafafa;
}

.box.formated .content {
  padding: 1rem 2rem;
}

i.top-left {
  position: absolute;
  left: 1.5rem;
  top: 0.8rem;
}

.vertical-separator {
  display: flex;
  justify-content: space-around;
}

.vertical-separator .line {
  border-right: 1px solid #cccccc;
}

.header {
  background-color: #3752f5;
}
</style>