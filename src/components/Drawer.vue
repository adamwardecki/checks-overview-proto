<template>
  <aside
    class="fixed top-0 z-50 w-1/3 h-full p-8 bg-white drop-shadow-md"
    :class="open ? 'drawer--open' : 'drawer--closed'"
  >
    <div class="flex justify-between align-middle">
      <h2 class="text-lg font-bold">XX:XX - XX:XX</h2>
      <p class="text-sm text-slate-500">See all</p>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Drawer',
  props: {
    open: Boolean,
  }
};
</script>

<style>
.drawer--open {
  right: 0;
  transition: right 1s;
}
.drawer--closed {
  right: -100%;
  transition: right 800ms;
}
</style>
