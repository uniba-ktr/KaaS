<template>
  <!-- BEGIN login -->
  <div class="login">
    <!-- BEGIN login-content -->
    <div class="login-content">
      <form v-on:submit.prevent="submitForm()" method="POST" name="login_form">
        <h1 class="text-center">Sign In</h1>
        <div class="text-white text-opacity-50 text-center mb-4">
          For your protection, please verify your identity.
        </div>
        <div class="mb-3">
          <label class="form-label"
            >Username <span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control form-control-lg bg-white bg-opacity-5"
            :class="!requiredText(authPayload.username) && usernameBlurred ? 'is-invalid': ''"
            placeholder=""
            v-model="authPayload.username"
          />
          <div class="invalid-feedback" v-if="usernameBlurred">
            Please provide a username
          </div>
        </div>
        <div class="mb-3">
          <div class="d-flex">
            <label class="form-label"
              >Password <span class="text-danger">*</span></label
            >
            <a
              href="#"
              class="ms-auto text-white text-decoration-none text-opacity-50"
              >Forgot password?</a
            >
          </div>
          <input
            type="password"
            class="form-control form-control-lg bg-white bg-opacity-5"
            :class="!requiredText(authPayload.password) && passwordBlurred ? 'is-invalid' : ''"
            placeholder=""
            v-model="authPayload.password"
          />
          <div class="invalid-feedback" v-if="passwordBlurred">
            Please provide a password
          </div>
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
              >Remember me</label
            >
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-outline-theme btn-lg d-block w-100 fw-500 mb-3"
        >
          Sign In
        </button>
        <div class="text-center text-white text-opacity-50">
          Don't have an account yet?
          <RouterLink to="/register">Sign up</RouterLink>.
        </div>
      </form>
    </div>
    <!-- END login-content -->
  </div>
  <!-- END login -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from "vue";
import { useAppOptionStore } from "@/stores/app-option";
import { useRoute, useRouter } from "vue-router";
// internal
import { requiredText } from "@/support/fieldRuleHelper";
import type { IAuthRequestPayload } from "@/models/auth-models";
import { useAuthStore } from "@/stores/app-auth";

const appOption = useAppOptionStore();
const store = useAuthStore();
const $route = useRoute();
const $router = useRouter();

const usernameBlurred = ref(false);
const passwordBlurred = ref(false);
const authPayload: IAuthRequestPayload = reactive({
  username: "",
  password: "",
});

const validateUsername = () => {
  usernameBlurred.value = true;
  if (requiredText(authPayload.username)) {
    usernameBlurred.value = false;
    return true;
  }
  return false;
};

const validatePassword = () => {
  passwordBlurred.value = true;
  if (requiredText(authPayload.password)) {
    passwordBlurred.value = false;
    return true;
  }
  return false;
};

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

const submitForm = async () => {
  const validUsername = validateUsername();
  const validPassword = validatePassword();
  if (validUsername && validPassword) {
    try {
      await store.DO_LOGIN(authPayload);
      const to = $route.query.to?.toString();
      await $router.push(to || "/");
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }
};
</script>

<style scoped></style>
