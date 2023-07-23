<template>
  <div class="content">
    <el-tabs v-model="activeName">
      <el-tab-pane label="授权管理" name="manage">
      </el-tab-pane>
      <el-tab-pane label="授权申请" name="apply">
      </el-tab-pane>
    </el-tabs>
    <Manage v-if="activeName === 'manage'"></Manage>
    <Apply v-else></Apply>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Apply from './apply.vue';
import Manage from './manage.vue';
const activeName = ref('manage')
</script>
<style scoped>
.content {
  background-color: var(--system-container-main-background);
  width: calc(100% - 60px);
  height: calc(100% - 30px);
  margin: 15px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 15px;
}
</style>