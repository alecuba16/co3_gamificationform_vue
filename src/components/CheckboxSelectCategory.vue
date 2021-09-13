<template>
  <section>
      <b-field :type="checkType" :message="checkMsg">
        <template slot="label">
                <p><span v-if="questionNumber" :class="requiredAnswer?'questionNumberRequired':'questionNumber'">{{questionNumber}}</span>{{label}}</p>
                <p><span class="has-text-danger is-italic is-tiny typeAnswer">Multiple answer</span></p>
      </template>
        <b-field expanded >
          <div class="block">
            <b-field 
              v-for="cat in tmpData.map((e)=>e[dataCategory]).filter((v, i, a) => a.indexOf(v) === i)"
              :label="cat"
              custom-class="fullwidthLabel"
              :key="cat"
              expanded
            >
              <b-field grouped group-multiline>
                <b-checkbox
                  class="socialNetworkItem"
                  v-for="item in getFromCategory(cat)"
                  :key="item[dataKey]"
                  v-model="selectedVal"
                  :native-value="item[dataKey]"
                  :type="checkType"
                  @input="(e)=>updated(false,cat,e)"
                >{{ item[dataText] }}</b-checkbox>
              </b-field>
            </b-field>
            <b-field v-if="includeOther" label="other" custom-class="fullwidthLabel">
              <b-field class="socialNetworkItem" grouped group-multiline>
                <b-checkbox v-model="otherSelected" :type="checkType"
                @input="(e)=>updated(true,this.otherCategory,e)"
                ></b-checkbox>
                <b-input
                  placeholder="Specify here"
                  v-model="otherContent"
                  :disabled="(otherSelected==null||otherSelected==false)"
                  :type="checkType"
                  @input="()=>updated(true,this.otherCategory)"
                ></b-input>
              </b-field>
            </b-field>
          </div>
        </b-field>
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
    dataKey: {
      type: String,
      default: "key"
    },
    dataCategory: {
      type: String,
      default: "category"
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
    }
  },
  mixins: [validationMixin],
  data() {
    return {
      otherKey: "$other",
      tmpData: [],
      otherSelected: null,
      otherContent: null,
      otherCategory: 'otherCategory',
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
        return this.otherSelected != null && this.otherSelected;
      })
    },
    otherCategory: {
      required: requiredIf(function() {
        return this.otherSelected != null && this.otherSelected;
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
          : (this.otherSelected && this.$v.otherContent.$invalid) ||
            (!this.otherSelected && this.$v.selectedVal.$invalid)
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
          ? "Please, choose at least one option"
          : !this.$v.otherSelected.$error && this.$v.otherContent.$error
          ? "Please, introduce indicate the other"
          : null;
      } else {
        return this.$v.selectedVal.$error
          ? "Please, choose at least one option"
          : "";
      }
    }
  },
  methods: {
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
    updated: function(other, cat,otherStatus) {
      var self = this;
      var isExclusiveChecked=this.dataExcludeKey != null&&this.selectedVal.length > 0&&this.selectedVal.indexOf(this.dataExcludeKey)>-1
      if (other) {
         if(otherStatus!=null&&!otherStatus){
          self.otherContent = null;
          self.otherSelected = null;
          self.otherCategory=null;
        }
        
        self.$emit("selected", {
          other: true,
          value: self.otherContent,
          category: self.otherCategory
        });
      } else {
        if (isExclusiveChecked) {
          //Uncheck others
          self.selectedVal = self.selectedVal.filter(sv => sv == this.dataExcludeKey);
          self.otherContent = null;
          self.otherSelected = null;
          self.otherCategory = null;
        } 
        self.$emit("selected", {
          other: false,
          value: self.selectedVal,
          category: cat
        });
      }
    },
    getFromCategory: function(category) {
      var self = this;
      return this.tmpData.length > 0
        ? this.tmpData.filter(e => e[self.dataCategory] == category)
        : null;
    }
  }
};
</script>

<style scoped>
.label.fullwidthLabel {
  width: 100% !important;
}
.socialNetworkItem {
  text-transform: capitalize;
  min-width: 150px;
  margin-left: 0.5em!important;
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
.requiredAnswer{
  font-size: 1.5em;
    margin-left: 0.2em;
    color: #4a4a4a;
}
</style>