<template>
  <div style="padding: 2rem 3rem; text-align: left;">
    <h1 class="title">{{ getLocalizedTitle(yourGamerMotivationsTitle, lang) }}</h1>
    <b-notification :closable="false">
      <b-loading :active.sync="profilesLoading" :is-full-page="true" :can-cancel="false">
        <b-icon pack="fas" icon="sync-alt" size="is-large" custom-class="fa-spin"></b-icon>
      </b-loading>
      <div id="chart" :v-if="series&&series.length>0">
        <apexchart type="radar" height="350" :options="chartOptions" :series="series"></apexchart>
      </div>
    </b-notification>

    <b-collapse v-if="similar_games" class="card" aria-id="contentIdForA11y3">
      <div slot="trigger" slot-scope="props" class="card-header" role="button" aria-controls="contentIdForA11y3">
        <p class="card-header-title">{{ getLocalizedTitle(similarToYou, lang) }}</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="content">
          <div v-if="similar_games && Array.isArray(similar_games) && similar_games.length > 0">
            <div class="media" v-for="(sg, index) in similar_games" :key="`sg-${index}`">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img :src="similar_games_img[index]" :alt="sg" />
                </figure>
              </div>
              <div class="media-content">
                <p class="subtitle is-6">{{ sg }}</p>
              </div>
            </div>
          </div>
          <div v-else-if="similar_games">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img :src="similar_games_img" :alt="similar_games" />
                </figure>
              </div>
              <div class="media-content">
                <p class="subtitle is-6">{{ similar_games }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import axios from "axios";
import mixCommon from "@/components/mixCommon.js";
import { JSONSERVER_URL, JSONSERVER_API_KEY, JSONSERVER_DATA_COLLECTION } from "@assets/constants.js";
//import {required,requiredIf} from 'vuelidate/lib/validators'
//import occupationsJson from '@assets/occupations.json'
//import educationLevelsJSON from '@assets/educationLevels.json'
//import genderListJSON from '@assets/genderList.json'

var errorSender = function(error){
    var xmlhttp = new XMLHttpRequest();
    var url=JSONSERVER_URL+"/"+JSONSERVER_ERROR_COLLECTION;
    console.log(JSONSERVER_API_KEY);
    xmlhttp.open('POST', JSONSERVER_URL+"/"+JSONSERVER_ERROR_COLLECTION, true);
    xmlhttp.setRequestHeader('x-api-key', JSONSERVER_API_KEY);
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(error));
}

export default {
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin, mixCommon],
  data() {
    return {
      yourGamerMotivationsTitle: {
        en: "Your gamer motivations",
        it: "Le tue motivazioni da giocatore",
        fr: "Vos motivations de joueur",
        el: "Τα κίνητρα των παικτών σας",
        es: "Tus motivaciones como jugador"
      },
      sourceData: {
        gameImportanceList: []
      },
      similarToYou: {
        en: "The games played by the people with a profile similar to you.",
        fr: "The games played by the people with a profile similar to you.",
        it: "The games played by the people with a profile similar to you.",
        el: "The games played by the people with a profile similar to you.",
        es: "Juegos jugados por gente con un perfil similar al tuyo."
      },
      similar_games: null,
      similar_games_img: null,
      profiles: [],
      profilesLoading: false,
      lang: "en",
      series: [],
      chartOptions: {
        chart: {
          height: 450,
          type: "radar",
          toolbar: {
            show: false
          }
        },
        title: {
          text: ""
        },
        yaxis: {
          show: false
        },
        xaxis: {
          categories: this.getLocalizedCategories(this)
        }
      }
    };
  },
  activated() {
    this.$emit("can-continue", { value: true });
    //this.getFormData();
    this.downloadOtherProfiles();
  },
  mounted() {
    this.$emit("can-continue", { value: true });
  },
  created() {
    var self = this;
    this.lang = this.$parent.$parent.lang;
    this.$eventHub.$on("changedLanguage", lang => {
      self.lang = lang;
      self.chartOptions.xaxis = self.getLocalizedCategories(self);
    });
    fetch("./assets/gameImportanceList39item.json")
      .then(r => r.json())
      .then(json => {
        self.sourceData.gameImportanceList = json.keyValueArray;
        self.getFormData();
      });
  },
  methods: {
    getLocalizedCategories(self) {
      var xaxis = [];
      var lang='en';
      if(!self.hasOwnProperty("$parent")||!self.$parent.hasOwnProperty("$parent")||!self.$parent.$parent.hasOwnProperty("lang")) lang=self.$parent.$parent.lang;
      switch (self.$parent.$parent.lang) {
        case "es":
          xaxis = ["Logros", "Mecánicas", "Competición", "Socialización", "Relaciones", "Trabajo en equipo", "Descubrimiento", "Juego de roles", "Personalización", "Evasión"];
          break;
        default:
          xaxis = ["Achievement", "Mechanics", "Competition", "Socializing", "Relationship", "Teamwork", "Discovery", "Role-Playing", "Customization", "Escapism"];
      }
      return xaxis;
    },
    getFormData() {
      if (
        this.hasOwnProperty("$parent") &&
        this.$parent != null &&
        this.$parent.hasOwnProperty("$parent") &&
        this.$parent.$parent != null &&
        this.$parent.$parent.hasOwnProperty("formData") &&
        this.$parent.$parent.formData != null
      ) {
        this.myProfileScore = this.computeScores(this, this.$parent.$parent.formData);
        this.series.push({ name: "Your profile", data: this.myProfileScore });
      }
    },
    computeScores(self, sc) {
      var q = {};
      var profile = {};
      var seriesData = [];
      //checklist
      var missing = self.sourceData.gameImportanceList.some(e => {
        if (sc.hasOwnProperty(e.key)) {
          q[e.keyNickYee] = sc[e.key];
        }
        return !sc.hasOwnProperty(e.key);
      });

      if (!missing) {
        //Achievement: Q14*0.68 + Q15*0.77 + Q16*0.81 + Q17*0.69 + Q7*0.53 + Q29*0.60
        profile["achievement"] = Math.round((q["Q14"] * 0.68 + q["Q15"] * 0.77 + q["Q16"] * 0.81 + q["Q17"] * 0.69 + q["Q7"] * 0.53 + q["Q29"] * 0.6) * 100) / 100;
        seriesData.push(profile["achievement"]);
        //· Mechanics: Q1*0.78 + Q2*0.65 + Q3*0.67 + Q18*0.69
        profile["mechanics"] = Math.round((q["Q1"] * 0.78 + q["Q2"] * 0.65 + q["Q3"] * 0.67 + q["Q18"] * 0.69) * 100) / 100;
        seriesData.push(profile["mechanics"]);
        //· Competition: Q25*0.64 + Q39*0.81 + Q26*0.72 + Q31*0.82
        profile["competition"] = Math.round((q["Q25"] * 0.64 + q["Q39"] * 0.81 + q["Q26"] * 0.72 + q["Q31"] * 0.82) * 100) / 100;
        seriesData.push(profile["competition"]);
        //· Socializing: Q23*0.82 + Q22*0.65 + Q24*0.77 + Q28*0.63
        profile["socializing"] = Math.round((q["Q23"] * 0.82 + q["Q22"] * 0.65 + q["Q24"] * 0.77 + q["Q28"] * 0.63) * 100) / 100;
        seriesData.push(profile["socializing"]);
        //· Relationship: Q32*0.71 + Q33*0.88 + Q34*0.86
        profile["relationship"] = Math.round((q["Q32"] * 0.71 + q["Q33"] * 0.88 + q["Q34"] * 0.86) * 100) / 100;
        seriesData.push(profile["relationship"]);
        //· Teamwork: Q4*0.79 + Q5*0.77 + Q6*0.60 + Q19*0.63
        profile["teamwork"] = Math.round((q["Q4"] * 0.79 + q["Q5"] * 0.77 + q["Q6"] * 0.6 + q["Q19"] * 0.63) * 100) / 100;
        seriesData.push(profile["teamwork"]);
        //· Discovery: Q11*0.82 + Q12*0.77 + Q13*0.55 +Q27*0.80
        profile["discovery"] = Math.round((q["Q11"] * 0.82 + q["Q12"] * 0.77 + q["Q13"] * 0.55 + q["Q27"] * 0.8) * 100) / 100;
        seriesData.push(profile["discovery"]);
        //· Role-Playing: Q30*0.66 + Q20*0.62 + Q35*0.83 + Q36*0.85
        profile["roleplaying"] = Math.round((q["Q30"] * 0.66 + q["Q20"] * 0.62 + q["Q35"] * 0.83 + q["Q36"] * 0.85) * 100) / 100;
        seriesData.push(profile["roleplaying"]);
        //· Customization: Q8*0.73 + Q9*0.81 + Q10*0.80
        profile["customization"] = Math.round((q["Q8"] * 0.73 + q["Q9"] * 0.81 + q["Q10"] * 0.8) * 100) / 100;
        seriesData.push(profile["customization"]);
        //· Escapism: Q37*0.81 + Q38*0.62 + Q21*0.83
        profile["Escapism"] = Math.round((q["Q8"] * 0.73 + q["Q9"] * 0.81 + q["Q10"] * 0.8) * 100) / 100;
        seriesData.push(profile["Escapism"]);
        return seriesData;
      } else {
        return null;
      }
    },
    downloadOtherProfiles() {
      var self = this;
      self.profilesLoading = true;
      axios
        .get(JSONSERVER_URL+"/" + JSONSERVER_DATA_COLLECTION + "/", {
          headers: { "x-api-key": JSONSERVER_API_KEY }
        })
        .then(response => {
          if (response.data.length > 0) {
            self.profiles = response.data.map(e=>{
              return({
                id: e._id,
                rawdata: e
              });
            });
            self.updateOtherProfiles(self.profiles);
            self.profilesLoading = false;
          } else {
            self.profilesLoading = false;
          }
        })
        .catch(err => {
          errorSender({
            error: "JSONSERVER:failed to get the data collection:" + err +", user agent:"+navigator.userAgent,
            testing: !isProduction
          });
          self.profilesLoading = false;
          console.log(err);
        });
    },
    updateOtherProfiles(othersProfile) {
      var self = this;
      var meanscores = null;
      var score;
      var nearestId;
      var nearestDist;
      var nearestScore;
      var eudist;
      othersProfile.forEach((e, idx) => {
        score = self.computeScores(self, e.rawdata);
        if (score != null) {
          if (meanscores == null) {
            meanscores = score;
          } else {
            score.forEach((e, idx2) => {
              meanscores[idx2] += e;
            });
          }
          if (idx == othersProfile.length - 1) {
            meanscores.forEach((e2, idx3) => {
              meanscores[idx3] = Math.round((e2 / othersProfile.length) * 100) / 100;
            });
          }
          //Euclidean distance
          var dif = 0;
          var totalDif = 0;
          score.forEach((s, idsc) => {
            dif = self.myProfileScore[idsc] - s;
            totalDif += dif * dif;
          });
          eudist = Math.sqrt(totalDif);
          if ((nearestId == null && eudist > 0) || (nearestId != null && eudist > 0 && nearestDist > eudist)) {
            nearestId = idx;
            nearestDist = eudist;
            nearestScore = score;
          }
        }
      });

      if (meanscores != null) {
        self.series.push({ name: "Average", data: meanscores });
        console.log("Meanscore calculated from:", othersProfile.length);
      }
      if (nearestScore != null) {
        self.series.push({ name: "People Similar to you", data: nearestScore });
        if (nearestId != null && othersProfile != null && Array.isArray(othersProfile) && othersProfile.length > 0 && othersProfile[nearestId] != null) {
          var tmp = othersProfile[nearestId].rawdata;
          if (tmp.hasOwnProperty("top3_favorite_games")) {
            if (Array.isArray(tmp.top3_favorite_games)) {
              self.similar_games = tmp.top3_favorite_games.map(gk => {
                if (gk.hasOwnProperty("name")) {
                  return gk.name;
                } else {
                  return "";
                }
              });
              self.similar_games_img = tmp.top3_favorite_games.map(gk => {
                if (gk.hasOwnProperty("background_image")) {
                  return gk.background_image;
                } else {
                  return "";
                }
              });
            } else if (tmp.top3_favorite_games.hasOwnProperty("name")) {
              self.similar_games = tmp.top3_favorite_games.name;
              if (tmp.top3_favorite_games.hasOwnProperty("background_image")) {
                self.similar_games_img = tmp.top3_favorite_games.background_image;
              }
            }
          }
        }
      }
    }
  }
};
</script>

<style scoped>
div.field.occupation:focus-within {
  min-height: 200px !important;
}
.marginBottom {
  margin-bottom: 2em !important;
}
.questionNumber {
  background-color: #6e6e6e;
  color: white;
  border-radius: 8px;
  padding: 5px;
}
.questionNumberRequired {
  background-color: #3752f5;
  color: white;
  border-radius: 8px;
  padding: 5px;
}
.label > p {
  margin-bottom: 0px !important;
}
.typeAnswer {
  font-size: 0.8em;
}
.requiredAnswer {
  font-size: 1.5em;
  margin-left: 0.2em;
  color: #4a4a4a;
}
.justified {
  text-align: justify;
}
.hrline {
  background-color: #303030;
}
.title {
  text-align: center;
}
.card-header-title {
  text-align: center;
}
.game_thumbnail {
  max-width: 20%;
}
</style>
