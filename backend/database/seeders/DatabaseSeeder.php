<?php
namespace Database\Seeders;
use App\Models\{Vehicle,TransferService,Testimonial,Faq};
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder {
    public function run(): void {
        $data=json_decode(file_get_contents(__DIR__.'/catalog.json'),true,512,JSON_THROW_ON_ERROR);
        foreach($data['vehicles'] as $v) Vehicle::firstOrCreate(['slug'=>$v['id']],[
            'name'=>$v['name'],'description'=>$v['description'],'passenger_capacity'=>$v['capacity'],
            'luggage_capacity'=>$v['luggageCapacity'],'base_price_cents'=>(int)round($v['supplement']*100),
            'image'=>$v['image'],'image_width'=>$v['imageWidth'],'image_height'=>$v['imageHeight'],
        ]);
        foreach($data['transferServices'] as $s) TransferService::firstOrCreate(['slug'=>$s['id']],[
            'name'=>$s['name'],'short_name'=>$s['shortName'],'description'=>$s['description'],'badge'=>$s['badge']??null,
            'duration'=>$s['duration'],'includes'=>$s['includes'],'base_price_cents'=>(int)round($s['basePrice']*100),
        ]);
        foreach($data['testimonials'] as $t) Testimonial::firstOrCreate(['slug'=>$t['id']],[
            'name'=>$t['name'],'source'=>$t['source'],'content'=>$t['text'],'avatar'=>$t['avatar'],'avatar_background'=>$t['avatarBackground'],
        ]);
        foreach($data['faqs'] as $i=>$f) Faq::firstOrCreate(['slug'=>$f['id']],['question'=>$f['question'],'answer'=>$f['answer'],'sort_order'=>$i]);
    }
}
