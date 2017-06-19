Dir.glob(Rails.root.join('lib', 'friends', '*.rb')).each do |f|
  require f
end
