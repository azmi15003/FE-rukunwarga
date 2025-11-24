<template>
  <div class="box">
    <el-form-item label="Tipe">
      <el-select v-model="node.type" placeholder="Pilih Tipe">
        <el-option label="Person" value="person" />
        <el-option label="Label" value="label" />
      </el-select>
    </el-form-item>

    <template v-if="node?.type === 'person'">
      <el-form-item label="Nama">
        <el-input v-model="node.data.name" />
      </el-form-item>

      <el-form-item label="Jabatan">
        <el-input v-model="node.data.title" />
      </el-form-item>

      <el-form-item label="Link Gambar">
        <el-input v-model="node.data.image" />
      </el-form-item>
    </template>

    <template v-else>
      <el-form-item label="Label">
        <el-input v-model="node.label" />
      </el-form-item>
    </template>

    <div class="child-section" v-if="node?.type === 'person'">
      <el-button size="small" @click="addChild">+ Tambah Anak</el-button>
      <div class="child-list" v-for="(child, i) in node && node.children" :key="child.key">
        <OrganizationNode v-model="node.children[i]" />
        <el-button type="danger" size="small" class="mt-5" @click="removeChild(i)">Hapus</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const node = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const addChild = () => {
  const newKey = node.value.key + '_' + node.value.children.length
  node.value.children.push({
    key: newKey,
    type: 'person',
    data: {
      name: '',
      title: '',
      image: ''
    },
    children: []
  })
}

const removeChild = (index) => {
  node.value.children.splice(index, 1)
}
</script>

<style scoped>
.box {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
}
.child-section {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px dashed #ccc;
}
</style>
