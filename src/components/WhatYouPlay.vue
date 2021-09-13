<template >
  <div class="modal-card-body" style="padding: 2rem 3rem; text-align: left;">
    <div class="marginBottom">
      <b-field>
        <template slot="label">
          <p>
            <span class="questionNumberRequired">P1</span>
            {{getLocalizedTitle(sourceData.hoursPlayAtWeekTitle,lang)}}
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
          min="0"
          max="150"
          v-model="form.hours_play_at_week"
        ></b-input>
      </b-field>
    </div>
    <div class="marginBottom">
      <TagSelectCallback
        ref="verify_child2"
        :label="getLocalizedTitle(sourceData.lastPlayedGameTitle,lang)"
        questionNumber="P2"
        varName="last_played_game"
        requiredAnswer
        data-key="name"
        :data="sourceData.gameList"
        @selected="(newValue)=>valueChanged(newValue,'last_played_game')"
        :maxtags="1"
        :placeholder="getLocalizedTagPlaceHolderSearch(lang)"
        :labelTypeAnswer="getLocalizedOpenAnswer(lang)"
        :errorMsg="getLocalizedTagError(lang)"
        open-on-focus
        :loading="isLoadingGames"
        :externalFiltering="true"
        :tagNote="getLocalizedTagNote(lang)"
        @typing="(text)=>getFiltered(text)"
      />
    </div>
    <div class="marginBottom">
      <TagSelectCallback
        ref="verify_child3"
        :label="getLocalizedTitle(sourceData.top3favoriteGames,lang)"
        questionNumber="P3"
        varName="top3_favorite_games"
        requiredAnswer
        data-key="name"
        :data="sourceData.gameList"
        @selected="(newValue)=>valueChanged(newValue,'top3_favorite_games')"
        :maxtags="3"
        :placeholder="getLocalizedTagPlaceHolderSearch(lang)"
        :labelTypeAnswer="getLocalizedOpenAnswer(lang)"
        :errorMsg="getLocalizedTagError(lang)"
        open-on-focus
        :loading="isLoadingGames"
        :externalFiltering="true"
        :tagNote="getLocalizedTagNote(lang)"
        @typing="(text)=>getFiltered(text)"
      />
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import axios from "axios";
import { requiredIf } from "vuelidate/lib/validators";
// import CheckboxSelect from "@/components/CheckboxSelect.vue";
import mixCommon from "@/components/mixCommon.js";
import TagSelectCallback from "@/components/TagSelectCallback.vue";
export default {
  props: ["clickedNext", "currentStep"],
  components: {
    // CheckboxSelect,
    TagSelectCallback
  },
  mixins: [validationMixin, mixCommon],
  data() {
    return {
      isLoadingGames: false,
      isInfoActive: false,
      sourceData: {
        lastPlayedGameTitle: {
          en: "What's the last game you played? ",
          it: "Qual è l'ultima partita a cui hai giocato?",
          el: "Ποιο είναι το τελευταίο παιχνίδι που παίξατε;",
          fr: "Quel est le dernier jeu auquel tu as joué?",
          es: "¿Cuál es el último juego que has jugado?"
        },
        top3favoriteGames: {
          en: "What are your three favorite games?",
          it: "Quali sono i tuoi tre giochi preferiti?",
          el: "Ποια είναι τα τρία αγαπημένα σας παιχνίδια;",
          fr: "Quels sont tes trois jeux préférés?",
          es: "¿Cuáles son tus tres juegos favoritos?"
        },
        hoursPlayAtWeekTitle: {
          en: "How many hours do you usually play per week?",
          it: "Quante ore di solito giochi alla settimana?",
          el: "Πόσες ώρες παίζετε συνήθως ανά εβδομάδα;",
          fr: "Combien d'heures jouez-vous habituellement par semaine?",
          es: "¿Cuántas horas sueles jugar por semana?"
        },
        gameList: []
      },
      form: {
        top3_favorite_games: [],
        last_played_game: [],
        hours_play_at_week: null
      }
    };
  },
  validations: {
    form: {
      top3_favorite_games: {
        required: requiredIf(function() {
          return true;
        })
      },
      last_played_game: {
        required: requiredIf(function() {
          return true;
        })
      },
      hours_play_at_week: {
        required: requiredIf(function() {
          return true;
        })
      }
    }
  },
  methods: {
    getFiltered(text) {
      this.sourceData.gameList = [];
      if (
        text != null &&
        text.hasOwnProperty("value") &&
        text.value.length > 2
      ) {
        this.isLoadingGames = true;
        this.getGames(text.value, true);
      } else {
        // this.isLoading = false;
        this.isLoadingGames = false;
      }
    },
    getGames(text) {
      var self = this;
      axios
        .get("https://api.rawg.io/api/games?search=" + text)
        .then(response => {
          if (
            response.status == 200 &&
            response.data.hasOwnProperty("results") &&
            response.data.results.length > 0
          ) {
            self.sourceData.gameList = response.data.results;
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          self.isLoadingGames = false;
        });
    },
    randomImportance(self) {
      self.forEach((e, idx) => {
        self[idx].value = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
      });
      return self;
    },
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
      this.sourceData.gameImportanceList[pos].value = value;
      this.checkSliders();
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
  },
  computed: {}
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
</style>