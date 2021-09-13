<template>
  <section>
    <!-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> -->
    <b-message v-if="lang=='es'">
      <p>!Hola!</p>      
      <p class="justified">
       Esta encuesta te permite conocer
        <b>tu perfil de jugador</b> desdel punto de vista de la
        <font color="#0070c0">gamificación</font>. Para poder asignarte un perfil, necesitamos saber un poco más sobre ti y el tipo de juegos que te gustan. Además, podrás conocer otros perfiles de jugadores a tu alrededor. Obtén más información sobre nuestra política de privacidad
        <a
          @click="isDataPrivacyActive = true"
        >aquí</a>.
      </p>
      <h2>
        <a @click="isInstructionActived = true">Instrucciones</a>
      </h2>
      <b-modal :active.sync="isInstructionActived" scroll="keep" :width="960">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <ul>
                <li v-if="requiredAnswers">
                  Las respuestas requeridas se identifican en color azul. (
                  <span
                    class="questionNumberRequired"
                  >Q1</span>)
                </li>
                <li v-if="optionalAnswers">
                  Las respuestas opcionales se identifican en color gris. (
                  <span class="questionNumber">Q1</span>)
                </li>
              </ul>
              <div v-if="singleAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  Las respuestas de
                  <span class="has-text-danger is-italic">selección simple</span> se completa seleccionando un elemento:
                </p>
                <p class="center">
                  <img src="@assets/single_es.gif" />
                </p>
              </div>
              <div v-if="multipleAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Las respuestas múltiples</span> se seleccionan haciendo click / tocando varios elementos:
                </p>
                <p class="center">
                  <img src="@assets/multiple_es.gif" />
                </p>
              </div>
              <div v-if="openAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  Las respuestas
                  <span class="has-text-danger is-italic justified">abiertas</span> pueden ser completadas insertanto texto (autocompletado si existiera) pulsando enter o presionando el botón verde:
                </p>
                <p class="center">
                  <img src="@assets/open1_es.gif" />
                </p>
                <p class="center">
                  <img src="@assets/open2_es.gif" />
                </p>
              </div>
              <div v-if="selectAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  Las respuestas con
                  <span class="has-text-danger is-italic">selector</span> se completan seleccionado cualquier elemento de la lista:
                </p>
                <p class="center">
                  <img src="@assets/select_es.gif" />
                </p>
              </div>
              <div v-if="sliderAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  La respuesta del control
                  <span class="has-text-danger is-italic">deslizante</span> se establece arrastrando / tocando:
                </p>
                <p class="center">
                  <img src="@assets/slider_es.gif" />
                </p>
              </div>
              <div v-if="numericAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  En la
                  <span class="has-text-danger is-italic">respuesta numérica</span>, debes introducir un número o usar las flechas:
                </p>
                <p class="center">
                  <img src="@assets/numeric_es.gif" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </b-modal>
    </b-message>   
    <!-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END ES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< -->

    <!-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> EL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> -->
    <b-message v-else-if="lang=='el'">
      <p>Hello!</p>
      <p class="justified">
        This survey allows you to know
        <b>your gamer profile</b>.
        In order to be able to assign your profile, we need to know a little bit more about you and the type of games you like. Also, you will be able to know other gamer profiles around you.
        Learn more about our
        <a
          @click="isDataPrivacyActive = true"
        >privacy policy</a>.
      </p>
      <h2>
        <a @click="isInstructionActived = true">Οδηγίες</a>
      </h2>
      <b-modal :active.sync="isInstructionActived" scroll="keep" :width="960">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <ul>
                <li v-if="requiredAnswers">
                  Οι υποχρεωτικές απαντήσεις σημειώνονται με μπλε (
                  <span class="questionNumberRequired">Υ1</span>)
                </li>
                <li v-if="optionalAnswers">
                  Οι προαιρετικές με γκρι (
                  <span class="questionNumber">Ε1</span>)
                </li>
              </ul>
              <div v-if="singleAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Η μονή απάντηση</span> επιλέγεται με κλικ:
                </p>
                <p class="center">
                  <img src="@assets/single_el.gif" />
                </p>
              </div>
              <div v-if="multipleAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Οι πολλαπλές απαντήσεις</span> επιλέγονται με κλικ σε πολλές απαντήσεις:
                </p>
                <p class="center">
                  <img src="@assets/multiple_el.gif" />
                </p>
              </div>
              <div v-if="openAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic justified">Οι ανοιχτές απαντήσεις</span> μπορούν να συμπληρωθούν εισάγοντας κείμενο και επιλέγοντας από τις προτεινόμενες απαντήσεις ή πατώντας το πράσινο σύμβολο ή εισάγοντας κόμμα/enter:
                </p>
                <p class="center">
                  <img src="@assets/open1_el.gif" />
                </p>
                <p class="center">
                  <img src="@assets/open2_el.gif" />
                </p>
              </div>
              <div v-if="selectAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Η απάντηση επιλογής</span> δίνεται επιλέγοντας ένα στοιχείο από την λίστα:
                </p>
                <p class="center">
                  <img src="@assets/select_el.gif" />
                </p>
              </div>
              <div v-if="sliderAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">">Η slider απάντηση</span> δίνεται με κύλιση της μπάρας:
                </p>
                <p class="center">
                  <img src="@assets/slider_el.gif" />
                </p>
              </div>
              <div v-if="numericAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Η αριθμητική απάντηση</span> δίνεται εισάγοντας έναν αριθμό ή χρησιμοποιώντας τα βέλη:
                </p>
                <p class="center">
                  <img src="@assets/numeric_el.gif" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </b-modal>
    </b-message>   
    <!-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END EL <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< -->

    <!-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> EN DEFAULT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> -->
    <b-message v-else>
      <p>Hello!</p>
      <p class="justified">
        This survey allows you to know
        <b>your gamer profile</b>.
        In order to be able to assign your profile, we need to know a little bit more about you and the type of games you like. Also, you will be able to know other gamer profiles around you.
        Learn more about our
        <a
          @click="isDataPrivacyActive = true"
        >privacy policy</a>.
      </p>
      <h2>
        <a @click="isInstructionActived = true">Instructions</a>
      </h2>
      <b-modal :active.sync="isInstructionActived" scroll="keep" :width="960">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <ul>
                <li v-if="requiredAnswers">
                  The required answers are identified in blue (
                  <span
                    class="questionNumberRequired"
                  >Q1</span>)
                </li>
                <li v-if="optionalAnswers">
                  Optional answers are identified in grey (
                  <span class="questionNumber">Q1</span>)
                </li>
              </ul>
              <div v-if="singleAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Single answer</span> is selected by click/touching:
                </p>
                <p class="center">
                  <img src="@assets/single_en.gif" />
                </p>
              </div>
              <div v-if="multipleAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Multiple answer</span> are selected by click/touching several items:
                </p>
                <p class="center">
                  <img src="@assets/multiple_en.gif" />
                </p>
              </div>
              <div v-if="openAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic justified">Open answer</span> can be completed by introducing the text and has to be confirmed by selecting from results or by pressing the green button or just by pressing enter/comma:
                </p>
                <p class="center">
                  <img src="@assets/open1_en.gif" />
                </p>
                <p class="center">
                  <img src="@assets/open2_en.gif" />
                </p>
              </div>
              <div v-if="selectAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Select answer</span> is set by choosing an element on the list:
                </p>
                <p class="center">
                  <img src="@assets/select_en.gif" />
                </p>
              </div>
              <div v-if="sliderAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Slider answer</span> is set by dragging/touching:
                </p>
                <p class="center">
                  <img src="@assets/slider_en.gif" />
                </p>
              </div>
              <div v-if="numericAnswers">
                <hr class="hrline" size="10" width="100%" />
                <p class="center">
                  <span class="has-text-danger is-italic">Numeric answer</span> is set by introducing a number or by using the arrows:
                </p>
                <p class="center">
                  <img src="@assets/numeric_en.gif" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </b-modal>
    </b-message>   
    <!-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< END EN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< -->

    <PrivacyPolicy
      :lang="lang"
      :isDataPrivacyActive="isDataPrivacyActive"
      @modalClosed="modalClosed"
    ></PrivacyPolicy>
  </section>
</template>
<script>
import PrivacyPolicy from "./PrivacyPolicy.vue";
export default {
  components: {
    PrivacyPolicy
  },
  data() {
    return {
      openInstructions: {
        en: "Instructions",
        it: "Instructions",
        fr: "Instructions",
        el: "Instructions",
        es: "Instrucciones"
      },
      closeInstructions: {
        en: "Close Instructions",
        it: "Close Instructions",
        fr: "Close Instructions",
        el: "Close Instructions",
        es: "Ocultar instrucciones"
      },
      isDataPrivacyActive: false,
      isInstructionActived: false
    };
  },
  props: {
    lang: {
      type: String,
      default: "en"
    },
    requiredAnswers: {
      type: Boolean,
      default: false
    },
    optionalAnswers: {
      type: Boolean,
      default: false
    },
    singleAnswers: {
      type: Boolean,
      default: false
    },
    multipleAnswers: {
      type: Boolean,
      default: false
    },
    openAnswers: {
      type: Boolean,
      default: false
    },
    selectAnswers: {
      type: Boolean,
      default: false
    },
    sliderAnswers: {
      type: Boolean,
      default: false
    },
    numericAnswers: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    modalClosed() {
      this.isDataPrivacyActive = false;
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
  border-top: 2px dotted #303030 !important;
}
</style>