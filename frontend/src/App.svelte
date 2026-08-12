<script lang="ts">
  import "./App.css";
  import { marked } from "marked";
  import page from "page";

  interface Note {
    id: number;
    title: string;
    content: string;
  }

  // --- Svelte 5 Runes: Состояние (State) ---
  let notes = $state<Note[]>([]);
  let title = $state("");
  let content = $state("");

  let activeNoteId = $state<number | null>(null);
  let isEditing = $state(false);
  let editTitle = $state("");
  let editContent = $state("");

  // --- Svelte 5 Runes: Вычисляемое состояние (Derived) ---
  let currentNote = $derived(
    activeNoteId !== null ? notes.find((n) => n.id === activeNoteId) ?? null : null
  );

  marked.setOptions({ gfm: true, breaks: true });

  async function fetchNotes() {
    try {
      const res = await fetch("http://localhost:8000/notes");
      notes = await res.json();
    } catch (err) {
      console.error("Ошибка загрузки заметок:", err);
    }
  }

  async function addNote() {
    if (!title.trim()) return;
    await fetch("http://localhost:8000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    title = "";
    content = "";
    await fetchNotes();
  }

  async function updateNote() {
    if (!currentNote) return;
    await fetch(`http://localhost:8000/notes/${currentNote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    isEditing = false;
    await fetchNotes();
  }

  function openNote(id: number) {
    page(`/note/${id}`);
  }

  function closeModal() {
    page("/");
  }

  function startEdit() {
    if (!currentNote) return;
    editTitle = currentNote.title;
    editContent = currentNote.content;
    isEditing = true;
  }

  async function copyContent(textToCopy: string) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("Скопировано! 🎉");
    } catch (err) {
      console.error("Ошибка копирования:", err);
      alert("Не скопировалось :(");
    }
  }

  // Настройка маршрутизатора
  page("/", () => {
    activeNoteId = null;
    isEditing = false;
  });

  page("/note/:id", (ctx) => {
    activeNoteId = Number(ctx.params.id);
    isEditing = false;
  });

  // --- Svelte 5 Runes: Эффекты ($effect вместо onMount) ---
  $effect(() => {
    fetchNotes();
    page.start();

    // Функция очистки при размонтировании
    return () => {
      page.stop();
    };
  });
</script>

<main>
  <h1>OmniScribe</h1>
  <p class="subtitle">
    Всякие интересные заметки. И... не очень интересные заметки.
  </p>
  <div class="input-group">
    <input bind:value={title} placeholder="Титлэ" />
    <textarea
      bind:value={content}
      placeholder="Контент (Markdown поддерживается)"
    ></textarea>
    <button onclick={addNote}>Добавить</button>
  </div>

  <div class="notes-list">
    {#each notes as note (note.id)}
      <div class="note-preview">
        <div 
          class="note-title" 
          onclick={() => openNote(note.id)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && openNote(note.id)}
        >
          <p>{note.title}</p>
        </div>
        <div class="note-actions">
          <button class="btn-small" onclick={() => copyContent(note.content)}>
            📋
          </button>
        </div>
      </div>
    {/each}
  </div>
</main>

{#if activeNoteId !== null && currentNote}
  <div 
    class="modal-overlay" 
    onclick={closeModal}
    role="presentation"
  >
    <div 
      class="modal-content" 
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      {#if isEditing}
        <div class="modal-header">
          <input bind:value={editTitle} placeholder="Заголовок" />
          <div class="modal-actions">
            <button onclick={() => copyContent(editContent)}>📋</button>
            <button onclick={updateNote}>Сохранить</button>
            <button onclick={() => (isEditing = false)}>Отмена</button>
          </div>
        </div>
        <textarea
          class="note-body"
          bind:value={editContent}
          placeholder="Содержимое (Markdown)"
        ></textarea>
      {:else}
        <div class="modal-header">
          <h2>{currentNote.title}</h2>
          <div class="modal-actions">
            <button onclick={() => copyContent(currentNote?.content ?? "")}>
              📋
            </button>
            <button onclick={startEdit}>Редактировать</button>
            <button onclick={closeModal}>Закрыть</button>
          </div>
        </div>
        <div class="note-body">{@html marked(currentNote.content)}</div>
      {/if}
    </div>
  </div>
{/if}