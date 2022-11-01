<template>
  <div
    class="px-2 py-1 mr-4 text-xs font-semibold border rounded hover:cursor-pointer"
    :class="active ? 'bg-slate-300 border-slate-300': 'border-black'"
  >
    {{ name }}
  </div>
</template>
<script>
export default {
  name: 'FilterItem',
  props: {
    name: String,
    active: Boolean,
  }
}
</script>