<template>
  <section>
    <b-field class="marginBottom" :type="checkType" :message="checkMsg">
      <template slot="label">
        <p>
          <span
            v-if="questionNumber"
            :class="requiredAnswer?'questionNumberRequired':'questionNumber'"
          >{{questionNumber}}</span>
          {{label}}
        </p>
        <p>
          <span class="has-text-danger is-italic is-tiny typeAnswer">{{labelTypeAnswer}}</span>
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
                :title="labelTypeAnswer"
                type="is-info"
                has-icon
                :active.sync="isInfoActive"
                aria-close-label="Close message"
                auto-close
                :duration="30000"
              >
                <img :src="require('@assets/open2_'+lang+'.gif')" />
              </b-message>
            </div>
          </span>
        </p>
      </template>
      <b-field grouped>
        <b-taginput
          expanded
          v-if="data==null||data==[]"
          ref="input"
          :type="checkType"
          v-model="selectedVal"
          :maxtags="maxtags"
          icon="label"
          :placeholder="placeholder"
          :open-on-focus="openOnFocus"
          @add="selected"
          @remove="selected"
          @typing="typingTags"
          :allow-new="allowNew"
          autocomplete
          :loading="loading"
        ></b-taginput>
        <b-taginput
          expanded
          v-if="dataKey!=null"
          ref="input"
          :type="checkType"
          v-model="selectedVal"
          :data="tmpData"
          :allow-new="allowNew"
          :maxtags="maxtags"
          :field="dataKey"
          icon="label"
          :placeholder="placeholder"
          autocomplete
          :open-on-focus="openOnFocus"
          @add="selected"
          @remove="selected"
          @typing="typingTags"
          :loading="loading"
        >
          <template slot-scope="props">
            <div v-if="templateField!=null&&templateField!=''">
              <strong class="marginLeft">{{props.option[templateField]}}</strong>
              : {{props.option[dataKey]}}
            </div>
            <div v-else slot-scope="props">{{props.option[dataKey]}}</div>
          </template>
        </b-taginput>
        <p v-if="newTag!=''" class="control">
          <button class="button is-success" @click="addNewTag">+</button>
        </p>
      </b-field>
    </b-field>
    <div class="tagNote" v-if="tagNote!=''">{{tagNote}}</div>
  </section>
</template>
<script>
import { validationMixin } from "vuelidate";
import { requiredIf } from "vuelidate/lib/validators";
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    labelTypeAnswer: {
      type: String,
      default: "Open answer"
    },
    questionNumber: {
      type: String,
      default: null
    },
    requiredAnswer: {
      type: Boolean,
      default: false
    },
    openOnFocus: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    lang: {
      type: String,
      default: "en"
    },
    allowNew: {
      type: Boolean,
      default: false
    },
    dataKey: {
      type: String,
      default: null
    },
    varName: {
      type: String,
      required: true
    },
    maxtags: {
      type: Number,
      default: 10
    },
    placeholder: {
      type: String,
      default: "Type to search"
    },
    templateField: {
      type: String,
      default: null
    },
    errorMsg: {
      type: String,
      default: "Please, introduce some tags"
    },
    tagNote: {
      type: String,
      default: ""
    },
    externalFiltering: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mixins: [validationMixin],
  data() {
    return {
      originalData: [],
      tmpData: [],
      isInfoActive: false,
      selectedVal: [],
      newTag: ""
    };
  },
  validations: {
    selectedVal: {
      required: requiredIf(function() {
        return this.requiredAnswer;
      })
    }
  },
  watch: {
    data: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        if (val != null && val.length > 0) {
          this.tmpData = val;
          this.originalData = val;
        }
      }
    }
  },
  computed: {
    checkType() {
      return this.$v.selectedVal.$error
        ? "is-danger"
        : this.$v.selectedVal.$invalid
        ? ""
        : "is-success";
    },
    checkMsg() {
      return this.$v.selectedVal.$error || this.$v.selectedVal.$error
        ? this.errorMsg
        : "";
    }
  },
  methods: {
    toggleInfo() {
      this.isInfoActive = !this.isInfoActive;
    },
    typingTags(text) {
      var self = this;
      if (this.externalFiltering) {
        this.tmpData = [];
        this.$emit("typing", { value: text });
        self.newTag = text;
      } else {
        self.updateFilteredTags(text);
      }
    },
    updateFilteredTags(text) {
      var self = this;
      if (this.originalData.length > 0) {
        self.tmpData = this.originalData.filter(option => {
          return (
            option[self.dataKey]
              .toString()
              .toLowerCase()
              .indexOf(text.toLowerCase()) >= 0
          );
        });
        self.newTag = self.tmpData.length == 0 ? text : "";
      } else {
        self.newTag = text;
        self.tmpData = [];
      }
    },
    touch() {
      this.$v.$touch();
    },
    selected: function() {
      console.log("selected");
      this.$emit("selected", { value: this.selectedVal });
      self.newTag = "";
    },
    addNewTag: function() {
      console.log("Add New Tag");
      if (this.selectedVal == null) {
        this.selectedVal = [];
      }
      this.selectedVal.push(this.newTag);
      this.tmpData = [];
      this.newTag = "";
      this.$refs.input.newTag = "";
      this.$v.selectedVal.$touch();
      this.$emit("selected", { value: this.selectedVal });
    }
  }
};
</script>

<style scoped>
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
.typeAnswer2 {
  font-size: 0.8em;
  margin-left: 0.6em;
}
.marginTop {
  margin-top: 0.5em;
}
.requiredAnswer {
  font-size: 1.5em;
  margin-left: 0.2em;
  color: #4a4a4a;
}
.tagNote {
  font-size: small;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  color: #4a4a4a;
  text-align: justify;
  text-justify: inter-word;
}
.marginBottom {
  margin-bottom: 0px !important;
}
.marginLeft {
  margin-left: 3px !important;
}
</style>