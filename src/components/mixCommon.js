export default {
  props: ["clickedNext", "currentStep"],
  data() {
    return {
      lang: "en",
      refs_: {},
      otherLabels: {
        en: "Other",
        it: "Altro",
        el: "Άλλο",
        fr: "Autre",
        es: "Otro"
      },
      otherPlaceholder: {
        en: "Specify here",
        it: "Specificare qui",
        el: "Καθορίστε εδώ",
        fr: "Précisez ici",
        es: "Especifica aquí"
      },
      otherInputError: {
        en: "Please, introduce the other",
        it: "Per favore, inserisci l'altro",
        el: "Παρακαλώ εισάγετε το άλλο",
        fr: "S'il vous plaît, présentez l'autre",
        es: "Por favor, introduce el otro"
      },
      tagErrorIntroduce: {
        en: "Please, introduce some text",
        it: "Per favore, introducete del testo",
        el: "Παρακαλώ εισάγετε κάποιο κείμενο",
        fr: "S'il vous plaît, introduisez du texte",
        es: "Por favor introduce algún texto"
      },
      selectOneError: {
        en: "Please, choose one option",
        it: "Per favore, scegli un'opzione",
        el: "Παρακαλώ επιλέξτε μία επιλογή",
        fr: "Veuillez choisir une option",
        es: "Por favor seleccione una opción"
      },
      selectMultipleError: {
        en: "Please, choose at least one option",
        it: "Per favore, scegli almeno un'opzione",
        el: "Επιλέξτε τουλάχιστον μία επιλογή",
        fr: "Veuillez choisir au moins une option",
        es: "Por favor seleccione al menos una opción"
      },
      tagPlaceHolder: {
        en: "Add text using '+' button  or ',' or press enter to confirm",
        it: "Separa le risposte con la virgola, o premi Invio dopo ognuna",
        el: "Προσθέστε τελεία και μετά πατήστε Enter",
        fr:
          "Ajouter du texte à l'aide des touches ',' ou appuyer sur la touche Entrée pour confirmer.",
        es:
          "Añade texto usando el botón ´+´ o pulsando la tecla coma para confirmar"
      },
      tagSearchPlaceHolder: {
        en: "Type 3 chars to search",
        it: "Digita 3 caratteri da cercare",
        el: "Τύποι 3 χαρακτήρες για αναζήτηση",
        fr: "Tapez 3 caractères à rechercher",
        es: "Escribe al menos 3 carácteres para buscar"
      },
      tagNewHelp: {
        en:
          "Note: To add a new, write, and confirm using a comma ',' or by pressing (+) button that will appear.",
        it:
          "Nota: per aggiungere un nuovo, scrivi e conferma usando una virgola ',' o premendo il pulsante (+) che apparirà.",
        el:
          "Σημείωση: Για να προσθέσετε ένα νέο, γράψτε και επιβεβαιώστε χρησιμοποιώντας ένα κόμμα ',' ή πατώντας το πλήκτρο (+) που θα εμφανιστεί.",
        fr:
          "Remarque: pour en ajouter un nouveau, écrivez et confirmez en utilisant une virgule ',' ou en appuyant sur le bouton (+) qui apparaît.",
        es:
          "Nota: Para añadir , escribir y confirmar, utiliza la coma o el símbolo +"
      },
      singleAnswer: {
        en: "Single answer",
        it: "Risposta singola",
        el: "Μονή απάντηση",
        fr: "Réponse unique",
        es: "Respuesta única"
      },
      numberAnswer: {
        en: "Numerical answer",
        it: "Risposta numerica",
        el: "Αριθμητική απάντηση",
        fr: "Réponse numérique",
        es: "Respuesta numérica"
      },
      multipleAnswer: {
        en: "Multiple answer",
        it: "Risposta multipla",
        el: "Πολλαπλές απαντήσεις",
        fr: "Choix multiple",
        es: "Selección múltiple"
      },
      openAnswer: {
        en: "Open answer",
        it: "Risposta aperta",
        el: "Ανοιχτή απάντηση",
        fr: "Réponse ouverte",
        es: "Respuesta abierta"
      },
      sliderAnswer: {
        en: "Sliders answer",
        it: "Risposta dello slider",
        el: "Απόκριση δρομέα",
        fr: "Réponse par curseur",
        es: "Respuesta deslizante"
      },
      select: {
        en: "Select an option",
        it: "Selezionare un'opzione",
        el: "Επιλέξτε μια επιλογή",
        fr: "Sélectionnez une option",
        es: "Seleccione una opción"
      },
      numberPlaceHolder: {
        en: "Number",
        it: "Numero",
        el: "Αριθμός",
        fr: "Numéro",
        es: "Número"
      },
      countryError: {
        en: "Please, choose a country",
        it: "Per favore, scegli un paese",
        el: "Επιλέξτε χώρα",
        fr: "Veuillez choisir un pays",
        es: "Por favor, seleccione un país"
      },
      regionError: {
        en: "Please, choose a region",
        it: "Per favore, scegli una regione",
        el: "Επιλέξτε μια περιοχή",
        fr: "Veuillez choisir une région",
        es: "Por favor seleccione una región"
      }
    };
  },
  mounted() {
    this.refs_ = this.$refs;
    if (!this.currentStep.hasOwnProperty("formData")) {
      this.currentStep.formData = {};
    }
    // if (this.$v!=undefined&&this.$v.$invalid) {
    //   this.$emit("can-continue", { value: false });
    // } else {
    //   this.$emit("can-continue", { value: true });
    // }
  },
  watch: {
    $v: {
      handler: function(val) {
        if (!val.$invalid) {
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { nextBtnValue: false });
          }, 3000);
        }
      },
      deep: true
    },
    form: {
      handler: function() {
        this.currentStep.formData = this.form;
      },
      deep: true
    },
    clickedNext(val) {
      //console.log(val); // eslint-disable-line no-console
      this.childValidations();
      if (val === true) {
        if (this.$v != undefined) this.$v.$touch();
      }
    }
  },
  created: function() {
    var self = this;
    this.lang = this.$parent.$parent.lang;
    this.$eventHub.$on("changedLanguage", newLang => (self.lang = newLang));
  },
  methods: {
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
    getLocalizedBase(variable, lang) {
      return variable.hasOwnProperty(lang)
        ? variable[lang]
        : variable[Object.keys(variable)[0]];
    },
    getLocalizedSingleAnswer(lang) {
      return this.getLocalizedBase(this.singleAnswer, lang);
    },
    getLocalizedNumberAnswer(lang) {
      return this.getLocalizedBase(this.numberAnswer, lang);
    },
    getLocalizedSliderAnswer(lang) {
      return this.getLocalizedBase(this.sliderAnswer, lang);
    },
    getLocalizedOtherPlaceholder(lang) {
      return this.getLocalizedBase(this.otherPlaceholder, lang);
    },
    getLocalizedMultipleAnswer(lang) {
      return this.getLocalizedBase(this.multipleAnswer, lang);
    },
    getLocalizedOpenAnswer(lang) {
      return this.getLocalizedBase(this.openAnswer, lang);
    },
    getLocalizedOtherLabel(lang) {
      return this.getLocalizedBase(this.otherLabels, lang);
    },
    getLocalizedOtherError(lang) {
      return this.getLocalizedBase(this.otherInputError, lang);
    },
    getLocalizedSelectOneError(lang) {
      return this.getLocalizedBase(this.selectOneError, lang);
    },
    getLocalizedSelectMultipleError(lang) {
      return this.getLocalizedBase(this.selectMultipleError, lang);
    },
    getLocalizedTagPlaceHolder(lang) {
      return this.getLocalizedBase(this.tagPlaceHolder, lang);
    },
    getLocalizedTagPlaceHolderSearch(lang) {
      return this.getLocalizedBase(this.tagSearchPlaceHolder, lang);
    },
    getLocalizedTagError(lang) {
      return this.getLocalizedBase(this.tagErrorIntroduce, lang);
    },
    getLocalizedSelect(lang) {
      return this.getLocalizedBase(this.select, lang);
    },
    getLocalizedNumberPlaceHolder(lang) {
      return this.getLocalizedBase(this.numberPlaceHolder, lang);
    },
    getLocalizedCountryError(lang) {
      return this.getLocalizedBase(this.countryError, lang);
    },
    getLocalizedRegionError(lang) {
      return this.getLocalizedBase(this.regionError, lang);
    },
    getLocalizedAnswer(keyValueArray, lang) {
      if (!lang) return [];
      if (keyValueArray != null && keyValueArray.length > 0) {
        return keyValueArray.map(function(cl) {
          var toReturn = {};
          Object.keys(cl).forEach(k => {
            if (k != "text") {
              toReturn[k] = cl[k];
            } else {
              toReturn[k] =
                cl[k] instanceof String || typeof cl[k] == "string"
                  ? cl[k]
                  : cl[k].hasOwnProperty(lang)
                  ? cl[k][lang]
                  : cl[k][Object.keys(cl[k])[0]];
            }
          });
          return toReturn;
        });
      } else {
        return [];
      }
    },
    getLocalizedTitle(title, lang) {
      if (!title || !lang) return "";
      if (title instanceof String || typeof title == "string") {
        return title;
      } else {
        return title.hasOwnProperty(lang)
          ? title[lang]
          : title[Object.keys(title)[0]];
      }
    },
    getLocalizedTagNote(lang) {
      return this.getLocalizedBase(this.tagNewHelp, lang);
    },
    valueChanged(newVal, variable, categoryVariable) {
      if (newVal) {
        this.form[variable] = newVal.value;
        if (categoryVariable) this.form[categoryVariable] = newVal.category;
        //if (this.$v.form.hasOwnProperty(variable)) this.$v.form[variable].$touch();
        if (
          this.$v != undefined &&
          this.$v.hasOwnProperty("form") &&
          this.$v.form.hasOwnProperty(variable)
        )
          this.$v.form[variable].$touch();
        if (
          categoryVariable &&
          this.$v != undefined &&
          this.$v.hasOwnProperty("form") &&
          this.$v.form.hasOwnProperty(categoryVariable)
        )
          this.$v.form[categoryVariable].$touch();
      }
    }
  }
};
