<template>
  <!-- BEGIN register -->
  <div class="register">
    <!-- BEGIN register-content -->
    <div class="register-content">
      <form
        v-on:submit.prevent="submitForm()"
        method="POST"
        name="register_form"
      >
        <h1 class="text-center">Sign Up</h1>
        <p class="text-white text-opacity-50 text-center">
          One Admin ID is all you need to access all the Admin services.
        </p>
        <div class="mb-3">
          <label class="form-label"
            >Name <span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control form-control-lg bg-white bg-opacity-5"
            :class="!validName() && nameBlurred ? 'is-invalid' : ''"
            placeholder="e.g John Smith"
            v-model="name"
          />
          <div
            class="invalid-feedback"
            id="validationInvalidInputFeedback"
            v-if="nameBlurred"
          >
            Please provide a name
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label"
            >Email Address <span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control form-control-lg bg-white bg-opacity-5"
            placeholder="username@address.com"
            value=""
          />
        </div>
        <div class="mb-3">
          <label class="form-label"
            >Password <span class="text-danger">*</span></label
          >
          <input
            type="password"
            class="form-control form-control-lg bg-white bg-opacity-5"
            value=""
          />
        </div>
        <div class="mb-3">
          <label class="form-label"
            >Confirm Password <span class="text-danger">*</span></label
          >
          <input
            type="password"
            class="form-control form-control-lg bg-white bg-opacity-5"
            value=""
          />
        </div>
        <div class="mb-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="customCheck1"
            />
            <label class="form-check-label" for="customCheck1"
              >I have read and agree to the <a href="#">Terms of Use</a> and
              <a href="#">Privacy Policy</a>.</label
            >
          </div>
        </div>
        <div class="mb-3">
          <button
            type="submit"
            class="btn btn-outline-theme btn-lg d-block w-100"
          >
            Sign Up
          </button>
        </div>
        <div class="text-white text-opacity-50 text-center">
          Already have an Admin ID?
          <RouterLink to="/login">Sign In</RouterLink>
        </div>
      </form>
    </div>
    <!-- END register-content -->
  </div>
  <!-- END register -->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAppOptionStore } from "@/stores/app-option";
import { useRouter, RouterLink } from "vue-router";

const appOption = useAppOptionStore();
const $router = useRouter();

const name = ref("");
const nameBlurred = ref(false);
const valid = ref(false);
const submitted = ref(false);

onMounted(() => {
  appOption.appSidebarHide = true;
  appOption.appHeaderHide = true;
  appOption.appContentClass = "p-0";
});

onUnmounted(() => {
  appOption.appSidebarHide = false;
  appOption.appHeaderHide = false;
  appOption.appContentClass = "";
});

const validate = () => {
  nameBlurred.value = true;
  if (validName()) {
    valid.value = true;
    nameBlurred.value = false;
  }
};

const validName = () => {
  const re = /^(?!\s*$).+/;
  return re.test(name.value.toLowerCase());
};

const submitForm = () => {
  validate();
  if (valid.value) {
    console.log(name.value);
  }
  //$router.push("/");
};
</script>

<style scoped></style>
