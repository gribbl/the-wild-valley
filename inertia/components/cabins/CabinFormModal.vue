<script setup lang="ts">
import type CabinDto from '#dtos/cabin'
import { useForm } from '@inertiajs/vue3'
import { LoaderIcon } from 'lucide-vue-next'
import { computed, watch, watchEffect } from 'vue'

const props = defineProps<{
  mode: 'add' | 'edit'
  cabin?: CabinDto | null
}>()

const open = defineModel<boolean>('open')

const form = useForm({
  name: '',
  capacity: [2],
  price: 250,
  discount: 0.0,
  description: '',
  image: null,
})

watchEffect(() => {
  if (props.mode === 'edit' && props.cabin) {
    form.name = props.cabin.name
    form.capacity = [props.cabin.capacity]
    form.price = props.cabin.price
    form.discount = props.cabin.discount
    form.description = props.cabin.description
  }
})

function onSuccess() {
  open.value = false
  form.reset()
}

function submit() {
  if (form.processing) return

  if (props.mode === 'edit' && props.cabin?.id) {
    form.put(`/cabins/${props.cabin.id}`, { onSuccess })
  } else {
    form.post('/cabins', { onSuccess })
  }
}

watch(open, (value) => {
  if (!value) form.clearErrors()
})

const description = computed(() => {
  return props.mode === 'add'
    ? 'Ajouter un nouveau chalet en remplissant les champs ci-dessous.'
    : 'Modifiez les informations du chalet.'
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="flex h-screen max-w-screen-sm flex-col sm:grid sm:h-auto sm:flex-none lg:max-w-screen-md"
    >
      <DialogHeader>
        <DialogTitle>{{ mode === 'add' ? 'Ajouter' : 'Modifier' }} un chalet</DialogTitle>
      </DialogHeader>

      <DialogDescription>
        {{ description }}
      </DialogDescription>

      <form
        id="form"
        class="flex flex-1 flex-col gap-4 md:py-4"
        enctype="multipart/form-data"
        autocomplete="off"
        @submit.prevent="submit"
      >
        <div class="flex h-full flex-col gap-4 md:flex-row">
          <div class="flex flex-col gap-4 md:flex-1">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between gap-3">
                <Label for="name">Nom</Label>
                <span v-if="form.errors.name" class="text-xs text-red-500 sm:hidden">
                  {{ form.errors.name }}
                </span>
              </div>
              <!-- @vue-ignore -->
              <Input id="name" v-model="form.name" :disabled="form.processing" />
              <span v-if="form.errors.name" class="hidden text-xs text-red-500 sm:block">
                {{ form.errors.name }}
              </span>
            </div>

            <NumberField
              id="price"
              v-model="form.price"
              :step="5"
              :min="5"
              :format-options="{
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol',
                currencySign: 'standard',
              }"
              :disabled="form.processing"
            >
              <div class="flex items-center justify-between gap-3">
                <Label for="price">Prix</Label>
                <span v-if="form.errors.price" class="text-xs text-red-500 sm:hidden">
                  {{ form.errors.price }}
                </span>
              </div>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
              <span v-if="form.errors.price" class="hidden text-xs text-red-500 sm:block">
                {{ form.errors.price }}
              </span>
            </NumberField>

            <NumberField
              id="discount"
              v-model="form.discount"
              :disabled="form.processing"
              :format-options="{
                style: 'percent',
              }"
              :min="0.0"
              :max="0.1"
              :step="0.01"
            >
              <div class="flex items-center justify-between gap-3">
                <Label for="discount">Remise</Label>
                <span v-if="form.errors.discount" class="text-xs text-red-500 sm:hidden">
                  {{ form.errors.discount }}
                </span>
              </div>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
              <span v-if="form.errors.discount" class="hidden text-xs text-red-500 sm:block">
                {{ form.errors.discount }}
              </span>
            </NumberField>

            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between gap-3">
                <Label for="capacity">Capacité</Label>
                <span v-if="form.errors.capacity" class="text-xs text-red-500 sm:hidden">
                  {{ form.errors.capacity }}
                </span>
              </div>
              <!-- @vue-ignore -->
              <Slider
                id="capacity"
                v-model="form.capacity"
                :default-value="[2]"
                :max="10"
                :min="2"
                :step="2"
                :disabled="form.processing"
              />
              <span class="text-sm text-muted-foreground"> {{ form.capacity[0] }} personnes </span>
              <span v-if="form.errors.capacity" class="hidden text-xs text-red-500 sm:block">
                {{ form.errors.capacity }}
              </span>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-4">
            <div class="flex flex-1 flex-col gap-1">
              <div class="flex items-center justify-between gap-3">
                <Label for="description">Description</Label>
                <span v-if="form.errors.description" class="text-xs text-red-500 sm:hidden">
                  {{ form.errors.description }}
                </span>
              </div>
              <!-- @vue-ignore -->
              <Textarea
                id="description"
                v-model="form.description"
                class="flex-1 resize-none"
                :disabled="form.processing"
              />
              <span v-if="form.errors.description" class="hidden text-xs text-red-500 sm:block">
                {{ form.errors.description }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between gap-3">
                <Label for="image">Image</Label>
                <span v-if="form.errors.image" class="text-xs text-red-500 sm:hidden">
                  {{ form.errors.image }}
                </span>
              </div>
              <Input
                id="image"
                class="file:text-foreground"
                :disabled="form.processing"
                type="file"
                @input="form.image = $event.target.files[0]"
              />
              <span v-if="form.errors.image" class="hidden text-xs text-red-500 sm:block">
                {{ form.errors.image }}
              </span>
            </div>
          </div>
        </div>
      </form>

      <DialogFooter>
        <Button
          type="submit"
          form="form"
          :disabled="form.processing"
          :aria-disabled="form.processing"
          :aria-label="mode === 'add' ? 'Ajouter le chalet' : 'Modifier le chalet'"
        >
          <LoaderIcon v-if="form.processing" class="mr-2 size-4 animate-spin" />
          <span>{{ mode === 'add' ? 'Ajouter le chalet' : 'Modifier le chalet' }}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
