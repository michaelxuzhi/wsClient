<template>
    <div>HomeMain</div>
    <HomeHeader></HomeHeader>
    <HomeAside></HomeAside>
</template>

<script>
import HomeHeader from './HomeHeader.vue';
import HomeAside from './HomeAside.vue';
export default {
    name: 'HomeMain',
    components: {
        HomeHeader,
        HomeAside,
    },
};
</script>

<style></style>
