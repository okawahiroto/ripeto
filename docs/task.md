  1. AdMob（Google）
  2. admob.google.com にアクセス
  3. Googleアカウントでサインイン → アプリ登録
  4. iOSアプリ・Androidアプリを各々登録（2つ）
  5. 各アプリの App ID（ca-app-pub-xxxxx~xxxxx 形式）を取得
  6. バナー広告ユニットを各アプリで作成 → Ad Unit ID（ca-app-pub-xxxxx/xxxxx 形式）を取得
  取得するキーは計4つ：
- ADMOB_IOS_APP_ID
- ADMOB_ANDROID_APP_ID
- ADMOB_BANNER_IOS:ca-app-pub-5433593308779439/3515674996
- ADMOB_BANNER_ANDROID：ca-app-pub-5433593308779439/5249452708
  1. RevenueCat                                                                                                                                                  
                                                                                                                                                                   
  2. app.revenuecat.com でアカウント作成
  3. プロジェクト作成 → iOSアプリ・Androidアプリを登録                                                                                                            
  4. Public SDK Key を各プラットフォームで取得                                                                                                                    
                                                                                                                                                                  
  取得するキーは2つ：                                                                                                                                             
  - REVENUECAT_API_KEY_IOS
  - REVENUECAT_API_KEY_ANDROID                              
                              
  ---
  注意点：                                                                                                                                                        
  - AdMobは審査があり、承認まで数日かかることがあります
  - RevenueCatの課金商品登録にはApp Store Connect / Google Play Consoleのアカウントが必要です（年$99 / 一回$25）                                                  
  - テスト中はAdMobのテスト用IDが使えます（アカウント取得前でもコード実装は先に進められます）                                                                     
                                                                                             