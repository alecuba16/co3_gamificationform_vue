<template>
  <div style="padding: 2rem 3rem; text-align: left;">
    <Instructions
      :lang="lang"
      requiredAnswers
      optionalAnswers
      multipleAnswers
      sliderAnswers
      numericAnswers
    ></Instructions>
    <hr class="hrline_about" size="10" width="100%" />
    <h1 class="title">{{getLocalizedTitle(sourceData.aboutYouTitle,lang)}}</h1>
    <div class="marginBottom">
      <b-field>
        <template slot="label">
          <p>
            <span class="questionNumberRequired">Y1</span>
            {{getLocalizedTitle(sourceData.birthTitle,lang)}}
          </p>
          <p>
            <span
              class="has-text-danger is-italic is-tiny typeAnswer"
            >{{getLocalizedNumberAnswer(lang)}}</span>
            <span class="is-italic is-tiny is-primary typeAnswer2">
              <b-button
                :disabled="isInfoActive"
                size="is-small"
                icon-left="info-circle"
                icon-pack="fas"
                @click="toggleInfo"
              ></b-button>
              <div class="marginTop">
                <b-message
                  :title="getLocalizedNumberAnswer(lang)"
                  type="is-info"
                  has-icon
                  :active.sync="isInfoActive"
                  aria-close-label="Close message"
                  auto-close
                  :duration="30000"
                >
                  <img :src="require('@assets/numeric_'+lang+'.gif')" />
                </b-message>
              </div>
            </span>
          </p>
        </template>
        <b-input
          :placeholder="getLocalizedNumberPlaceHolder(lang)"
          type="number"
          :min="new Date().getFullYear()-100"
          :max="new Date().getFullYear()-18"
          v-model="form.birth"
        ></b-input>
      </b-field>
    </div>

    <div class="marginBottom">
      <b-field>
        <RadioSelect
          ref="verify_child2"
          :label="getLocalizedTitle(sourceData.genderListTitle,lang)"
          questionNumber="Y2"
          selectName="gender"
          horizontal
          :data="getLocalizedAnswer(sourceData.genderList,lang)"
          @selected="(newValue)=>valueChanged(newValue,'gender')"
          requiredAnswer
          :lang="lang"
          :otherLabel="getLocalizedOtherLabel(lang)"
          :introduceOtherError="getLocalizedOtherError(lang)"
          :chooseOptionError="getLocalizedSelectOneError(lang)"
          :labelTypeAnswer="getLocalizedSingleAnswer(lang)"
          :otherPlaceholder="getLocalizedOtherPlaceholder(lang)"
        />
      </b-field>
    </div>

    <b-field :type="countryType" :message="getLocalizedCountryError(lang)">
      <template slot="label">
        <p>
          <span class="questionNumberRequired">Y3</span>
          {{getLocalizedTitle(sourceData.countryTitle,lang)}}
        </p>
        <p>
          <span
            class="has-text-danger is-italic is-tiny typeAnswer"
          >{{getLocalizedSingleAnswer(lang)}}</span>
        </p>
      </template>
      <b-field>
        <div class="marginBottom">
          <b-select
            :placeholder="getLocalizedSelect(lang)"
            v-model="form.country"
            icon="globe"
            icon-pack="fas"
            @input="()=>countryChanged()"
          >
            <option
              v-for="option in sourceData.countryRegionList.map(e=>e.countryName)"
              :value="option"
              :key="option"
            >{{ option}}</option>
          </b-select>
        </div>
      </b-field>
    </b-field>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import RadioSelect from "@/components/RadioSelect.vue";
import mixCommon from "@/components/mixCommon.js";
import Instructions from "@/components/Instructions.vue";
//import {required,requiredIf} from 'vuelidate/lib/validators'
//import occupationsJson from '@assets/occupations.json'
//import educationLevelsJSON from '@assets/educationLevels.json'
//import genderListJSON from '@assets/genderList.json'

export default {
  components: {
    RadioSelect,
    Instructions
  },
  mixins: [validationMixin, mixCommon],
  data() {
    return {
      lang: "en",
      isInfoActive: false,
      sourceData: {
        educationLevels: [],
        educationLevelsTitle: "",
        genderList: [],
        genderListTitle: "",
        educationRoleListTitle: "",
        countryRegionList: [],
        countryTitle: {
          en: "Country",
          it: "Nazione",
          el: "Χώρα",
          fr: "Pays",
          es: "País"
        },
        regionTitle: {
          en: "Region",
          it: "Regione",
          el: "Περιοχή",
          fr: "Région",
          es: "Región"
        },
        birthTitle: {
          en: "Please indicate your year of birth",
          it: "In che anno sei nat?",
          el: "Παρακαλείσθε να αναφέρετε το έτος γέννησής σας",
          fr: "Indiquez votre année de naissance",
          es: "Por favor indique su año de nacimiento"
        },
        aboutYouTitle: {
          en: "About you",
          it: "About you",
          fr: "About you",
          el: "About you",
          es: "Sobre ti"
        }
      },
      form: {
        gender: null,
        educationlevel: null,
        birth: null,
        country: null,
        region: null
      }
    };
  },
  validations: {
    form: {
      gender: {
        required
      },
      birth: {
        required
      },
      country: {
        required
      }
    }
  },
  created: function() {
    var self = this;
    this.lang = this.$parent.$parent.lang;
    this.$eventHub.$on("changedLanguage", lang => (self.lang = lang));
    fetch("./assets/genderList.json")
      .then(r => r.json())
      .then(json => {
        self.sourceData.genderList = json.keyValueArray;
        self.sourceData.genderListTitle = json.title;
      });
    fetch("./assets/countryRegionList.json")
      .then(r => r.json())
      .then(json => {
        self.sourceData.countryRegionList = json;
      });
  },
  activated() {
    // this.$emit("can-continue", { value: true });
  },
  mounted() {
    // this.$emit("can-continue", { value: true });
  },
  methods: {
    getRegionsOfCountry() {
      var self = this;
      var regions = [];
      if (self.form.country != null) {
        var selectedCountry = this.sourceData.countryRegionList.filter(
          c => c.countryName == self.form.country
        )[0];
        regions = selectedCountry.regions.map(r => r.name);
      }
      return regions;
    },
    countryChanged() {
      var self = this;
      this.form.region = null;
      this.form.region = this.sourceData.countryRegionList.filter(
        c => c.countryName == self.form.country
      )[0].regions[0].name;
      if (this.$v.form.hasOwnProperty("region")) this.$v.form.region.$touch();
    },
    toggleInfo() {
      this.isInfoActive = !this.isInfoActive;
    }
  },

  computed: {
    countryType() {
      return this.$v.form.country.$error
        ? "is-danger"
        : this.$v.form.country.$invalid
        ? ""
        : "is-success";
    },
    regionType() {
      return this.$v.form.region.$error
        ? "is-danger"
        : this.$v.form.region.$invalid
        ? ""
        : "is-success";
    }
  }
  //   created() {
  //     var self = this;
  //     this.lang = this.$parent.$parent.lang;
  //     this.$eventHub.$on("changedLanguage", lang => (self.lang = lang));
  //   }
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
.hrline_about {
  background-color: #303030;
  height: 10px;
  border-radius: 5px;
}
</style>