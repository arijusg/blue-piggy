

Project/Build/Feature/Scenario/step/img1.png

Run CodeceptJS
CodececptJS hook after step 
  -> Save screenshots locally
  -> If e2e tests fail -> FAIL do not procceed with visual test
  -> If e2e tests pass
    -> Upload to S3 bucket -> ProjectID/BuildID/*
    -> Run a comparison lambda with ProjectID and BuildID as parameters
      -> Build a flat tree of images
        -> ProjectID/Base/Feature/Scenario/step/img1.png
        -> ProjectID/BuildID/Feature/Scenario/step/img1.png
          -> If base does not exist -> Mark as *  .diff.png
          -> If build image does not exits -> Mark as diff
          -> The diff stored
            -> Project/Build/Feature/Scenario/step/img1.diff.png
            -> If diff approved
              -> copy img1.diff.png -> /Project/Base/Feature/Scenario/step/img1.png
              -> rename img1.diff.png -> img1.diff.accept.png
            -> If diff reject
              -> rename img1.diff.png -> img1.diff.reject.png
    
    -> Generate result
      -> Scan the build tree and search for *.reject.png
        -> Find none -> PASS test
        -> Find some -> FAIL test
            