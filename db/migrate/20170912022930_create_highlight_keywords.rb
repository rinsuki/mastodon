class CreateHighlightKeywords < ActiveRecord::Migration[5.1]
  def change
    create_table :highlight_keywords do |t|
      t.references :account, foreign_key: { on_delete: :cascade }, null: false
      t.string :word
      t.timestamps
    end
  end
end
