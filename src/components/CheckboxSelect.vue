<template>
  <section>
    <b-field :type="checkType" :message="checkMsg">
       <template slot="label">
                <p><span v-if="questionNumber" :class="requiredAnswer?'questionNumberRequired':'questionNumber'">{{questionNumber}}</span>{{label}}</p>
                <p>
            <span v-if="!isInfoActive" class="has-text-danger is-italic is-tiny typeAnswer">{{labelTypeAnswer}}</span>
            <span class="is-italic is-tiny is-primary typeAnswer2">
              <b-button :disabled="isInfoActive" size="is-small" icon-left="info-circle" icon-pack="fas"  @click="toggleInfo">
              </b-button>
              <div class="marginTop">
                <b-message :title="labelTypeAnswer" type="is-info" has-icon :active.sync="isInfoActive" aria-close-label="Close message" auto-close :duration=30000>
                    <img :src="require('@assets/multiple_'+lang+'.gif')" />
                </b-message>
              </div>
              </span>
            </p>
      </template>
      <div class="block">
        <div v-if="!horizontal&vertical">
          <b-field v-for="item in tmpData" :key="item[dataKey]">
            <b-checkbox
              :type="checkType"
              v-model="selectedVal"
              :name="selectName"
              :native-value="item[dataKey]"
              @input="(e)=>updatedCheckbox(false,e)"
              :disabled="isDisabled(item[dataKey])"
            >
              <b-icon v-if="dataIcon!=null" :pack="item[dataIconPack]" :icon="item[dataIcon]"></b-icon>
              {{item[dataText]}}
            </b-checkbox>
          </b-field>
          <b-field v-if="includeOther" grouped group-multiline>
            <b-checkbox
              :type="checkType"
              v-model="otherSelected"
              :name="selectName"
              :native-value="otherKey"
              :disabled="isDisabled(otherKey)"
              @input="(e)=>updatedCheckbox(true,e)"
            >{{otherLabel}}</b-checkbox>
            <div class="marginLeft">
              <b-input
                :placeholder="otherPlaceholder"
                v-model="otherContent"
                :disabled="(otherSelected==null||otherSelected==false)"
                :type="checkType"
                @input="updatedInput"
              ></b-input>
            </div>
          </b-field>
        </div>
        <!--        HORIZONTAL        -->
        <b-field v-if="horizontal" position="is-centered">
          <b-checkbox
            v-for="item in tmpData"
            :key="item[dataKey]"
            :type="checkType"
            v-model="selectedVal"
            :name="selectName"
            :native-value="item[dataKey]"
            :disabled="isDisabled(item[dataKey])"
            @input="(e)=>updatedCheckbox(false,e)"
          >
            <b-icon v-if="dataIcon" :pack="item[dataIconPack]" :icon="item[dataIcon]"></b-icon>
            {{item[dataText]}}
          </b-checkbox>
          <b-field v-if="includeOther" grouped group-multiline>
            <b-checkbox
              :type="checkType"
              v-model="otherSelected"
              :name="selectName"
              :native-value="otherKey"
              @input="(e)=>updatedCheckbox(true,e)"
              :disabled="isDisabled(otherKey)"
            >{{otherLabel}}</b-checkbox>
            <div class="marginLeft">
              <b-input
                custom-class="marginLeft"
                :placeholder="otherPlaceholder"
                v-model="otherContent"
                :disabled="(otherSelected==null||otherSelected==false)"
                :type="checkType"
                @input="updatedInput"
              ></b-input>
            </div>
          </b-field>
        </b-field>
        <!--        Multiline        -->
        <b-field v-if="!vertical&&!horizontal" grouped group-multiline>
          <div class="equalWidth" v-for="item in tmpData" :key="item[dataKey]">
            <b-checkbox
              :type="checkType"
              v-model="selectedVal"
              :name="selectName"
              :native-value="item[dataKey]"
              :disabled="isDisabled(item[dataKey])"
              @input="(e)=>updatedCheckbox(false,e)"
            >
              <b-icon v-if="dataIcon!=null" :pack="item[dataIconPack]" :icon="item[dataIcon]"></b-icon>
              {{item[dataText]}}
            </b-checkbox>
          </div>
          <b-field v-if="includeOther" grouped group-multiline>
            <b-checkbox
              :type="checkType"
              v-model="otherSelected"
              :name="selectName"
              :native-value="otherKey"
              :disabled="isDisabled(otherKey)"
              @input="(e)=>updatedCheckbox(true,e)"
            >{{otherLabel}}</b-checkbox>
            <div class="marginLeft">
              <b-input
                custom-class="marginLeft"
                :placeholder="otherPlaceholder"
                v-model="otherContent"
                :disabled="(otherSelected==null||otherSelected==false)"
                :type="checkType"
                @input="updatedInput"
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
      default:"Multiple answer"
    },
    questionNumber: {
      type: String,
      default: null
    },
    requiredAnswer:{
      type: Boolean,
      default: false
    },
    lang:{
      type: String,
      default:"en"
    },
    data: {
      type: Array,
      required: true
    },
    dataKey: {
      type: String,
      default: "key"
    },
    dataExcludeKey: {
      type: String,
      default: null
    },
    dataText: {
      type: String,
      default: "text"
    },
    dataIcon: {
      type: String,
      default: null
    },
    dataIconPack: {
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
    vertical: {
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
    otherPlaceholder:{
      type: String,
      default: "Specify here"
    },
    chooseOptionError:{
      type: String,
      default: "Please, choose at least one option"
    },
    introduceOtherError:{
      type: String,
      default: "Please, introduce the other"
    }
  },
  mixins: [validationMixin],
  data() {
    return {
      isInfoActive:false,
      tmpData: [],
      otherSelected: null,
      otherContent: null,
      selectedVal: []
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
        return (
          this.includeOther == true &&
          (this.selectedVal == [] || this.selectedVal == null)
        );
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
        return this.$v.selectedVal.$error
          ? this.chooseOptionError
          : "";
      }
    }
  },
  methods: {
    toggleInfo() {
                this.isInfoActive=!this.isInfoActive;
            },
    isDisabled(currentKey){
      if(currentKey){
        if(this.dataExcludeKey&&this.selectedVal.indexOf(this.dataExcludeKey)>-1){
          return !(this.dataExcludeKey==currentKey)
        }else{
          return false;          
        }
      }else{
        return false;
      }
    },
    touch() {
      this.$v.$touch();
    },
    updatedCheckbox: function(other, otherStatus) {
      var self = this;
      var isExclusiveChecked=this.dataExcludeKey != null&&this.selectedVal.length > 0&&this.selectedVal.indexOf(this.dataExcludeKey)>-1
      if (other) {
        if (otherStatus != null && !otherStatus) {
          self.otherContent = null;
          self.otherSelected = null;
        }else{
          self.otherContent='';
        }
        self.$emit("selected", { other: true, value: self.otherContent});
      } else {        
        if (isExclusiveChecked) {
          //Uncheck others
          self.selectedVal = self.selectedVal.filter(sv => sv == this.dataExcludeKey);
          self.otherContent = null;
          self.otherSelected = null;
        }
        self.$emit("selected", { other: false, value: self.selectedVal});
      }
    },
    updatedInput: function() {
      var self = this;
      self.$emit("selected", { other: true, value: self.otherContent});
    }
  }
};
</script>

<style scoped>
.marginLeft {
  margin-left: 0.7em !important;
}
.equalWidth {
  width: 10em !important;
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
.circle-icon {
    background: #4a4a4a !important;
    padding:100px !important;
    border-radius: 50% !important;
}
</style>