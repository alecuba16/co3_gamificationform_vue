<template>
  <section>
    <b-field :type="checkType" :message="checkMsg">
       <template slot="label">
                <p><span v-if="questionNumber" :class="requiredAnswer?'questionNumberRequired':'questionNumber'">{{questionNumber}}</span>{{label}}</p>
                <p><span class="has-text-danger is-italic is-tiny typeAnswer">{{labelTypeAnswer}}</span>
                <span class="is-italic is-tiny is-primary typeAnswer2">
                  <b-button :disabled="isInfoActive" size="is-small" icon-left="info-circle" icon-pack="fas"  @click="toggleInfo">
                  </b-button>
                  <div class="marginTop">
                  <b-message :title="labelTypeAnswer" type="is-info" has-icon :active.sync="isInfoActive" aria-close-label="Close message" auto-close :duration=30000>
                      <img :src="require('@assets/single_'+lang+'.gif')" />
                  </b-message>
                  </div>
                </span>
                </p>
      </template>
      <div class="block">
        <div v-if="!horizontal">
          <b-field v-for="item in tmpData" :key="item[dataKey]">
            <b-radio
              :type="checkType"
              v-model="selectedVal"
              :name="selectName"
              :native-value="item[dataKey]"
              @input="()=>updated(false)"
            >
              <b-icon v-if="dataIcon" pack="fab" :icon="item[dataIcon]" :type="checkType"></b-icon>
              {{item[dataText]}}
            </b-radio>
          </b-field>
          <b-field v-if="includeOther">
            <b-radio
              :type="checkType"
              v-model="otherSelected"
              :name="selectName"
              :native-value="otherKey"
              @input="()=>updated(true)"
            >{{otherLabel}}</b-radio>
            <div class="marginLeft">
              <b-input
                :placeholder="otherPlaceholder"
                v-model="otherContent"
                :disabled="otherSelected!=otherKey"
                :type="checkType"
                @input="()=>updated(true)"
              ></b-input>
            </div>
          </b-field>
        </div>
        <!--        HORIZONTAL        -->
        <b-field position="is-centered" v-else>
          <b-radio
            v-for="item in tmpData"
            :key="item[dataKey]"
            :type="checkType"
            v-model="selectedVal"
            :name="selectName"
            :native-value="item[dataKey]"
            @input="()=>updated(false)"
          >
            <b-icon v-if="dataIcon" pack="fab" :icon="item[dataIcon]" :type="checkType"></b-icon>
            {{item[dataText]}}
          </b-radio>
          <b-field v-if="includeOther">
            <b-radio
              :type="checkType"
              v-model="otherSelected"
              :name="selectName"
              :native-value="otherKey"
              @input="()=>updated(true)"
            >{{otherLabel}}</b-radio>
            <div class="marginLeft">
              <b-input
                custom-class="marginLeft"
                :placeholder="otherPlaceholder"
                v-model="otherContent"
                :disabled="otherSelected!=otherKey"
                :type="checkType"
                @input="()=>updated(true)"
              ></b-input>
            </div>
          </b-field>
        </b-field>
      </div>
    </b-field>
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
    labelTypeAnswer:{
      type: String,
      default:"Single answer"
    },
    questionNumber: {
      type: String,
      default: null
    },
    requiredAnswer:{
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true
    },
    lang:{
      type: String,
      default:"en"
    },
    dataKey: {
      type: String,
      default: "key"
    },
    dataText: {
      type: String,
      default: "text"
    },
    dataIcon: {
      type: String,
      default: null
    },
    includeOther: {
      type: Boolean,
      default: false
    },
    selectName: {
      type: String,
      required: true
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    excludeKeys: {
      type: Array,
      default: () => []
    },
    otherKey: {
      type: String,
      default: "$other"
    },
    otherLabel:{
      type: String,
      default: "Other"
    },
    chooseOptionError:{
      type: String,
      default: "Please, choose one option"
    },
    introduceOtherError:{
      type: String,
      default: "Please, introduce the other"
    },
    otherPlaceholder:{
      type: String,
      default: "Specify here"
    },
  },
  mixins: [validationMixin],
  data() {
    return {
      tmpData: [],
      isInfoActive:false,
      tmpLabel:'',
      otherSelected: null,
      otherContent: null,
      selectedVal: null
    };
  },
  validations: {
    selectedVal: {
      required: requiredIf(function() {
        return (
          this.includeOther == false ||
          (this.includeOther &&
            (this.otherSelected == null || this.otherSelected == false))
        );
      })
    },
    otherSelected: {
      required: requiredIf(function() {
        return this.includeOther == true && this.selectedVal == null;
      })
    },
    otherContent: {
      required: requiredIf(function() {
        return this.otherSelected != null;
      })
    }
  },
  watch: {
    data: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        if (val != null && val.length > 0) {
          var self = this;
          this.tmpData = val.filter(
            e =>
              self.excludeKeys.length == 0 ||
              (self.excludeKeys.length > 0 &&
                self.excludeKeys.indexOf(e.key) == -1)
          );
        }
      }
    }
  },
  computed: {
    checkType() {
      if (this.includeOther) {
        return this.$v.selectedVal.$error ||
          this.$v.otherSelected.$error ||
          this.$v.otherContent.$error
          ? "is-danger"
          : this.$v.selectedVal.$invalid ||
            this.$v.otherContent.$invalid ||
            this.$v.otherContent.$error
          ? ""
          : "is-success";
      } else {
        return this.$v.selectedVal.$error
          ? "is-danger"
          : this.$v.selectedVal.$invalid
          ? ""
          : "is-success";
      }
    },
    checkMsg() {
      if (this.includeOther) {
        return this.$v.selectedVal.$error || this.$v.otherSelected.$error
          ? this.chooseOptionError
          : !this.$v.otherSelected.$error && this.$v.otherContent.$error
          ? this.introduceOtherError
          : null;
      } else {
        return this.$v.selectedVal.$error ? this.chooseOptionError : "";
      }
    }
  },
  methods: {
    toggleInfo() {
                this.isInfoActive=!this.isInfoActive;
            },
    touch() {
      this.$v.$touch();
    },
    updated: function(other) {
      if(other){
        this.selectedVal = null;
        this.$emit("selected", { other: true, value: this.otherContent });
      }else{
        this.otherContent = null;
        this.otherSelected = null;
        this.$emit("selected", { other: false, value: this.selectedVal });
      }
    }
  }
};
</script>

<style scoped>
.marginLeft {
  margin-left: 0.7em !important;
}
.questionNumber{
    background-color: #6e6e6e;
    color: white;
    border-radius: 8px;
    padding: 5px;
    margin-right: 5px;
}
.questionNumberRequired{
    background-color: #3752f5;
    color: white;
    border-radius: 8px;
    padding: 5px;
    margin-right: 5px;
}
.label>p{
  margin-bottom: 0px !important;
}
.typeAnswer{
    font-size: 0.8em;
    margin-left: 2em;
}
.typeAnswer2{
    font-size: 0.8em;
    margin-left: 0.6em;
}
.marginTop{
  margin-top:0.5em;
}
.requiredAnswer{
  font-size: 1.5em;
    margin-left: 0.2em;
    color: #4a4a4a;
}
.title{
  background-color: rgba(230, 230, 230, 1);
    border-color: rgba(230, 230, 230, 1);
    border-style: solid;
    border-radius: 10px;
}
</style>