<template >
  <div class="modal-card-body" style="padding: 2rem 3rem; text-align: left;">
    <b-field>
      <template slot="label">
        <p class="intro">{{getLocalizedTitle(sourceData.gameImportanceListIntro,lang)}}</p>
        <p>
          <span class="questionNumberRequired">D1</span>
          {{getLocalizedTitle(sourceData.gameImportanceListTitle,lang)}}
        </p>
        <p>
          <span
            class="has-text-danger is-italic is-tiny typeAnswer"
          >{{getLocalizedSliderAnswer(lang)}}</span>
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
                :title="getLocalizedSliderAnswer(lang)"
                type="is-info"
                has-icon
                :active.sync="isInfoActive"
                aria-close-label="Close message"
                auto-close
                :duration="30000"
              >
                <img :src="require('@assets/slider_'+lang+'.gif')" />
              </b-message>
            </div>
          </span>
        </p>
        <p>
          <span class="tagNote">{{getLocalizedTitle(sourceData.gameImportanceListScaleTitle,lang)}}</span>
        </p>
      </template>
      <div class="block marginBottom">
        <div
          class="field is-small sliderMargin"
          v-for="item in getLocalizedAnswer(getFilteredImportance(sourceData.gameImportanceList),lang)"
          :key="item.key"
        >
          {{item.text}}
          <b-slider
            :min="0"
            :max="5"
            ticks
            @change="(v)=>changeImportance(v,item.key)"
            :v-model="item.value"
          >
            <b-slider-tick v-for="val in [0,1,2,3,4,5]" :key="item.key+val" :value="val">{{val}}</b-slider-tick>
          </b-slider>
        </div>
      </div>
    </b-field>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
// import CheckboxSelect from "@/components/CheckboxSelect.vue";
import mixCommon from "@/components/mixCommon.js";
export default {
  props: ["clickedNext", "currentStep"],
  components: {},
  mixins: [validationMixin, mixCommon],
  created: function() {
    var self = this;
    fetch("./assets/gameImportanceList39item.json")
      .then(r => r.json())
      .then(json => {
        self.sourceData.gameImportanceList = json.keyValueArray;
        self.sourceData.gameImportanceListTitle = json.title;
        self.sourceData.gameImportanceListIntro = json.intro;
        self.sourceData.gameImportanceListScaleTitle = json.scale_title;
      });
  },
  data() {
    return {
      isLoadingGames: false,
      isInfoActive: false,
      sourceData: {
        gameImportanceList: [],
        gameImportanceListTitle: "",
        gameImportanceListScaleTitle: "",
        gameImportanceListIntro: "",
        gameList: []
      },
      form: {}
    };
  },
  validations: {},
  methods: {
    toggleInfo() {
      this.isInfoActive = !this.isInfoActive;
    },
    checkSliders() {
      var self = this;
      this.sourceData.gameImportanceList.map(function(e) {
        self.form[e.key] = e.value;
        self.currentStep.formData[e.key] = e.value;
      });
    },
    changeImportance(value, key) {
      var pos = this.sourceData.gameImportanceList
        .map(function(e) {
          return e.key;
        })
        .indexOf(key);
      this.$emit("can-continue", { value: true });
      this.sourceData.gameImportanceList[pos].value = value;
      this.checkSliders();
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    getFilteredImportance(ip) {
      return ip.filter(e => {
        return !e.hasOwnProperty("excluded");
      });
    }
  }
};
</script>

<style scoped>
.control-label {
  min-width: 150px;
}
.otherInputBox {
  margin-left: 0.5em;
}
.onlineItemsInvisible {
  display: none;
}
.typeAnswer2 {
  font-size: 0.8em;
  margin-left: 0.6em;
}
.modal {
  display: block !important; /* I added this to see the modal, you don't need this */
}

/* Important part */
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
  height: 250px;
  overflow-y: auto;
}
/* .modal.has-overflow {
  position: fixed !important;
  overflow: auto !important;
  .modal-background {
    position: fixed !important;
  }
  .modal-content {
    overflow: visible !important;
  }
  .modal-card {
    overflow: visible !important;
  }
  .modal-card-body {
    overflow: visible !important;
  }
} */
.questionNumber {
  background-color: #6e6e6e;
  color: white;
  border-radius: 8px;
  padding: 5px;
  margin-right: 5px;
}
.questionNumberRequired {
  background-color: #3752f5;
  color: white;
  border-radius: 8px;
  padding: 5px;
  margin-right: 5px;
}
.label > p {
  margin-bottom: 0px !important;
}
.typeAnswer {
  font-size: 0.8em;
  margin-left: 2em;
}
.requiredAnswer {
  font-size: 1.5em;
  margin-left: 0.2em;
  color: #4a4a4a;
}
.marginBottom {
  margin-bottom: 2em !important;
}
.tagNote {
  font-size: x-small;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  color: #4a4a4a;
  text-align: justify;
  text-justify: inter-word;
  padding-bottom: 10px;
}
.intro {
  font-size: small;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  padding-bottom: 10px;
  text-align: justify;
  text-justify: inter-word;
}

.control-label {
  min-width: 150px;
}
.otherInputBox {
  margin-left: 0.5em;
}
.onlineItemsInvisible {
  display: none;
}
.typeAnswer2 {
  font-size: 0.8em;
  margin-left: 0.6em;
}
.modal {
  display: block !important; /* I added this to see the modal, you don't need this */
}

/* Important part */
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
  height: 250px;
  overflow-y: auto;
}
</style>