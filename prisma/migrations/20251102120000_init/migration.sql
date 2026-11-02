-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "outlet_id" TEXT,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "work_item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "source_requirement_id" TEXT,
    "story_en" TEXT,
    "story_vi" TEXT,
    "acceptance" JSONB,
    "rice_reach" INTEGER,
    "rice_impact" INTEGER,
    "rice_confidence" INTEGER,
    "rice_effort" INTEGER,
    "external_url" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_item_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "idea" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "confidence" DECIMAL,
    "missing_info" JSONB,
    "shaped_json" JSONB,
    "work_item_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "report" (
    "id" TEXT NOT NULL,
    "week_start" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "body" JSONB,
    "mode" TEXT,
    "failure_flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "decision" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "made_by" TEXT NOT NULL,
    "at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "module" (
    "id" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_vi" TEXT NOT NULL,
    "body_en" TEXT NOT NULL,
    "body_vi" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "module_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "prompt_en" TEXT NOT NULL,
    "prompt_vi" TEXT NOT NULL,
    "choices_en" JSONB NOT NULL,
    "choices_vi" JSONB NOT NULL,
    "correct_index" INTEGER NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "completion" (
    "person_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "completed_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "completion_pkey" PRIMARY KEY ("person_id","module_id")
);

CREATE TABLE "audit_event" (
    "id" TEXT NOT NULL,
    "at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "detail" JSONB NOT NULL,

    CONSTRAINT "audit_event_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "idea" ADD CONSTRAINT "idea_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "idea" ADD CONSTRAINT "idea_work_item_id_fkey" FOREIGN KEY ("work_item_id") REFERENCES "work_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "decision" ADD CONSTRAINT "decision_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "question" ADD CONSTRAINT "question_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "completion" ADD CONSTRAINT "completion_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "completion" ADD CONSTRAINT "completion_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
