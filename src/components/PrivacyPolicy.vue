<template>
  <section>
    <b-modal
      v-if="lang=='en'"
      :active="isModalActive"
      @close="modalClosed"
      :width="width"
      scroll="keep"
    >
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h1 class="title">PERSONAL DATA WE COLLECT ABOUT YOU</h1>
            <h2 class="subtitle">Data collected</h2>
            <p>We collect and process the following data:</p>
            <ul>
              <li>country, gender, birthday (age)</li>
              <li>gamer profile</li>
            </ul>

            <h2 class="subtitle">Data use</h2>
            <p>Based on your profile, offer you a gamer profile. You are responsible for the accuracy of the information you provide to us.</p>
            <h2 class="subtitle">Data disclosure</h2>
            <p>
              We treat your personal data with strict confidentiality in accordance with applicable law.
              CO3 project will ensure that your information will be kept strictly confidential and will not be passed to a third party.
            </p>
            <h2 class="subtitle">Answers to surveys</h2>
            <p>Your hereby explicitly consent to the transfer of your information data only for research purposes.</p>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-if="lang=='it'"
      :active="isModalActive"
      @close="modalClosed"
      :width="width"
      scroll="keep"
    >
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h1 class="title">PERSONAL DATA WE COLLECT ABOUT YOU</h1>
            <h2 class="subtitle">Data collected</h2>
            <p>We collect and process the following data:</p>
            <ul>
              <li>country, gender, birthday (age)</li>
              <li>gamer profile</li>
            </ul>

            <h2 class="subtitle">Data use</h2>
            <p>Based on your profile, offer you a gamer profile. You are responsible for the accuracy of the information you provide to us.</p>
            <h2 class="subtitle">Data disclosure</h2>
            <p>
              We treat your personal data with strict confidentiality in accordance with applicable law.
              CO3 project will ensure that your information will be kept strictly confidential and will not be passed to a third party.
            </p>
            <h2 class="subtitle">Answers to surveys</h2>
            <p>Your hereby explicitly consent to the transfer of your information data only for research purposes.</p>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-if="lang=='fr'"
      :active="isModalActive"
      @close="modalClosed"
      :width="width"
      scroll="keep"
    >
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h1 class="title">PERSONAL DATA WE COLLECT ABOUT YOU</h1>
            <h2 class="subtitle">Data collected</h2>
            <p>We collect and process the following data:</p>
            <ul>
              <li>country, gender, birthday (age)</li>
              <li>gamer profile</li>
            </ul>

            <h2 class="subtitle">Data use</h2>
            <p>Based on your profile, offer you a gamer profile. You are responsible for the accuracy of the information you provide to us.</p>
            <h2 class="subtitle">Data disclosure</h2>
            <p>
              We treat your personal data with strict confidentiality in accordance with applicable law.
              CO3 project will ensure that your information will be kept strictly confidential and will not be passed to a third party.
            </p>
            <h2 class="subtitle">Answers to surveys</h2>
            <p>Your hereby explicitly consent to the transfer of your information data only for research purposes.</p>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-if="lang=='el'"
      :active="isModalActive"
      @close="modalClosed"
      :width="width"
      scroll="keep"
    >
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h1 class="title">PERSONAL DATA WE COLLECT ABOUT YOU</h1>
            <h2 class="subtitle">Data collected</h2>
            <p>We collect and process the following data:</p>
            <ul>
              <li>country, gender, birthday (age)</li>
              <li>gamer profile</li>
            </ul>

            <h2 class="subtitle">Data use</h2>
            <p>Based on your profile, offer you a gamer profile. You are responsible for the accuracy of the information you provide to us.</p>
            <h2 class="subtitle">Data disclosure</h2>
            <p>
              We treat your personal data with strict confidentiality in accordance with applicable law.
              CO3 project will ensure that your information will be kept strictly confidential and will not be passed to a third party.
            </p>
            <h2 class="subtitle">Answers to surveys</h2>
            <p>Your hereby explicitly consent to the transfer of your information data only for research purposes.</p>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal v-if="lang=='es'" :active.sync="isModalActive" :width="width" scroll="keep">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <h1 class="title">DATOS PERSONALES QUE RECOPILAMOS SOBRE USTED</h1>
            <h2 class="subtitle">Datos recolectados</h2>
            <p>Recopilamos y procesamos los siguientes datos:</p>
            <ul>
              <li>país, género, cumpleaños (edad)</li>
              <li>perfil de jugador</li>
            </ul>

            <h2 class="subtitle">Uso de datos</h2>
            <p>Según su perfil, le ofrecemos un perfil de jugador. Usted es responsable de la precisión de la información que nos proporciona.</p>
            <h2 class="subtitle">Divulgación de datos</h2>
            <p>Tratamos sus datos personales con estricta confidencialidad de acuerdo con la ley aplicable. El proyecto CO3 garantizará que esta información se mantenga estrictamente confidencial y no pase a un tercero.</p>
            <h2 class="subtitle">Respuestas a encuestas</h2>
            <p>Por la presente, consiente explícitamente la transferencia de esta información solo con fines de investigación.</p>
          </div>
        </div>
      </div>
    </b-modal>
  </section>
</template>
<script>
export default {
  data() {
    return {
      isModalActive: false
    };
  },
  props: {
    lang: {
      type: String,
      default: "en"
    },
    isDataPrivacyActive: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 900
    }
  },
  watch: {
    isDataPrivacyActive: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        this.isModalActive = val;
      }
    }    
  },
  methods: {
    modalClosed() {
      this.$emit("modalClosed", true);
    }
  }
};
</script>
<style scoped>
</style>