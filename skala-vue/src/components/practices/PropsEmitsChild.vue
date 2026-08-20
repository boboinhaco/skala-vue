<script setup>
defineProps({
    parentData: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['update-requesst'])
const sendNotification = () => {
    const payload = 'Child에서 가공한 데이터'
    emit('update-requesst', payload)
}
</script>

<template>
    <div class="child-container">
        <h2>하위 컴포넌트 (Child)</h2>
        <p>수신된 Props 데이터: <strong>{{ parentData }}</strong></p>
        <br />

        <button @click="sendNotification">상위 컴포넌트로 갱신 요청 (Emit)</button>
    </div>
</template>

<style>

</style>