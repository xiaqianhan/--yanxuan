<template>
  <div class="loading-container">
    <!-- 加载中的页面效果 -->
    <div class="loading">
        <img src="../assets/img/loading.svg" alt="">
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.loading-container{
// .container{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: rgba(153,153,153,0.5);
    .loading{
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        img{
            height: 100%;
            width: 100%;
        }
    }
}
</style>
